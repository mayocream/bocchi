import os
import time
import urllib.request
import multiprocessing
import pandas as pd
from datetime import timedelta
from dotenv import load_dotenv
from sqlalchemy import create_engine
import re
from multiprocessing import Pool
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(processName)s - %(levelname)s - %(message)s',
    datefmt='%Y-%m-%d %H:%M:%S'
)
logger = logging.getLogger(__name__)

load_dotenv()

# IMDB dataset files
IMDB_FILES = [
    'name.basics.tsv.gz',
    'title.akas.tsv.gz',
    'title.basics.tsv.gz',
    'title.crew.tsv.gz',
    'title.episode.tsv.gz',
    'title.principals.tsv.gz',
    'title.ratings.tsv.gz'
]

# Base URL for IMDB datasets
IMDB_BASE_URL = 'https://datasets.imdbws.com/'
DATA_DIR = 'data/imdb'

# Ensure the data directory exists
os.makedirs(DATA_DIR, exist_ok=True)

def format_time(seconds):
    """Format seconds into a readable time string."""
    return str(timedelta(seconds=round(seconds)))

def download_file(filename):
    """Download a file using standard library."""
    filepath = os.path.join(DATA_DIR, filename)
    if not os.path.exists(filepath):
        url = f"{IMDB_BASE_URL}{filename}"
        logger.info(f"Downloading {url}")
        urllib.request.urlretrieve(url, filepath)
        logger.info(f"Downloaded {filename}")
    else:
        logger.info(f"File {filename} already exists, skipping download")
    return filepath

def to_snake_case(name):
    """Convert a string to snake_case."""
    # Replace dots and hyphens with underscores
    s1 = re.sub(r'[.\-]', '_', name)
    # Insert underscore between lowercase and uppercase letters
    s2 = re.sub(r'([a-z0-9])([A-Z])', r'\1_\2', s1)
    # Convert to lowercase
    return s2.lower()

def process_file(filename):
    """Process a single file and insert into database."""
    process_name = multiprocessing.current_process().name
    logger.info(f"[{process_name}] Starting to process {filename}")

    # Convert filename to snake_case table name
    base_name = os.path.splitext(os.path.splitext(filename)[0])[0]
    table_name = f"imdb_{to_snake_case(base_name)}"
    filepath = os.path.join(DATA_DIR, filename)

    # Create a new connection for this process
    connection = create_engine(os.getenv('DATABASE_URL'), connect_args={'connect_timeout': 10})

    start_time = time.time()
    total_rows = 0

    # First, read a small sample to get column names
    sample_df = pd.read_csv(filepath, sep='\t', na_values='\\N', compression='gzip', nrows=1)
    column_names = [to_snake_case(col) for col in sample_df.columns]

    # Create a dictionary of dtype='str' for each column
    dtype_dict = {col: 'str' for col in column_names}

    for chunk_num, chunk in enumerate(pd.read_csv(filepath, sep='\t', na_values='\\N', compression='gzip',
                                                chunksize=50000, dtype=dtype_dict)):
        # Convert column names to snake_case
        chunk.columns = [to_snake_case(col) for col in chunk.columns]

        try:
            # Use to_sql with dtype parameter to ensure text datatypes in the database
            from sqlalchemy.types import Text
            dtype_sql = {col: Text() for col in chunk.columns}

            chunk.to_sql(table_name, connection, if_exists='append' if chunk_num > 0 else 'replace',
                        index=False, dtype=dtype_sql)
            total_rows += len(chunk)

            logger.info(f"[{process_name}] {table_name}: Processed {total_rows} rows so far...")

        except Exception as e:
            logger.error(f"[{process_name}] Error processing {filename}: {str(e)}")

    elapsed = time.time() - start_time
    logger.info(f"[{process_name}] Completed {table_name}: {total_rows} rows in {format_time(elapsed)}")

    return filename, total_rows, elapsed

def download_all_files():
    """Download all files in sequence."""
    for filename in IMDB_FILES:
        download_file(filename)

def main():
    start_time = time.time()

    # First download all files if needed (sequential operation)
    logger.info("Starting file downloads...")
    download_all_files()
    logger.info("All downloads completed")

    # Use process pool for parallel processing
    num_processes = min(len(IMDB_FILES), multiprocessing.cpu_count())
    logger.info(f"Starting processing with {num_processes} processes")

    results = []
    with Pool(processes=num_processes) as pool:
        # Map files to process_file function
        results = pool.map(process_file, IMDB_FILES)

    # Print summary of all results
    logger.info("=== Processing Summary ===")
    total_rows = 0
    for filename, rows, file_time in results:
        total_rows += rows
        logger.info(f"{filename}: {rows} rows in {format_time(file_time)}")

    total_elapsed = time.time() - start_time
    logger.info(f"Total processing time: {format_time(total_elapsed)}")
    logger.info(f"Total rows processed: {total_rows}")

if __name__ == "__main__":
    main()
