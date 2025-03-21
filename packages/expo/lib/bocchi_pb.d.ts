import * as jspb from 'google-protobuf'

import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb'; // proto import: "google/protobuf/empty.proto"
import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"


export class RegisterRequest extends jspb.Message {
  getEmail(): string;
  setEmail(value: string): RegisterRequest;

  getUsername(): string;
  setUsername(value: string): RegisterRequest;

  getPassword(): string;
  setPassword(value: string): RegisterRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RegisterRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RegisterRequest): RegisterRequest.AsObject;
  static serializeBinaryToWriter(message: RegisterRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RegisterRequest;
  static deserializeBinaryFromReader(message: RegisterRequest, reader: jspb.BinaryReader): RegisterRequest;
}

export namespace RegisterRequest {
  export type AsObject = {
    email: string,
    username: string,
    password: string,
  }
}

export class AccessToken extends jspb.Message {
  getToken(): string;
  setToken(value: string): AccessToken;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): AccessToken.AsObject;
  static toObject(includeInstance: boolean, msg: AccessToken): AccessToken.AsObject;
  static serializeBinaryToWriter(message: AccessToken, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): AccessToken;
  static deserializeBinaryFromReader(message: AccessToken, reader: jspb.BinaryReader): AccessToken;
}

export namespace AccessToken {
  export type AsObject = {
    token: string,
  }
}

export class LoginRequest extends jspb.Message {
  getEmail(): string;
  setEmail(value: string): LoginRequest;
  hasEmail(): boolean;
  clearEmail(): LoginRequest;

  getUsername(): string;
  setUsername(value: string): LoginRequest;
  hasUsername(): boolean;
  clearUsername(): LoginRequest;

  getPassword(): string;
  setPassword(value: string): LoginRequest;

  getHandleCase(): LoginRequest.HandleCase;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LoginRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LoginRequest): LoginRequest.AsObject;
  static serializeBinaryToWriter(message: LoginRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LoginRequest;
  static deserializeBinaryFromReader(message: LoginRequest, reader: jspb.BinaryReader): LoginRequest;
}

export namespace LoginRequest {
  export type AsObject = {
    email?: string,
    username?: string,
    password: string,
  }

  export enum HandleCase { 
    HANDLE_NOT_SET = 0,
    EMAIL = 1,
    USERNAME = 2,
  }
}

export class GetProfileRequest extends jspb.Message {
  getId(): number;
  setId(value: number): GetProfileRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProfileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetProfileRequest): GetProfileRequest.AsObject;
  static serializeBinaryToWriter(message: GetProfileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetProfileRequest;
  static deserializeBinaryFromReader(message: GetProfileRequest, reader: jspb.BinaryReader): GetProfileRequest;
}

export namespace GetProfileRequest {
  export type AsObject = {
    id: number,
  }
}

export class GetProfileResponse extends jspb.Message {
  getId(): number;
  setId(value: number): GetProfileResponse;

  getUsername(): string;
  setUsername(value: string): GetProfileResponse;

  getName(): string;
  setName(value: string): GetProfileResponse;

  getBio(): string;
  setBio(value: string): GetProfileResponse;

  getAvatarUrl(): string;
  setAvatarUrl(value: string): GetProfileResponse;

  getCoverUrl(): string;
  setCoverUrl(value: string): GetProfileResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetProfileResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetProfileResponse): GetProfileResponse.AsObject;
  static serializeBinaryToWriter(message: GetProfileResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetProfileResponse;
  static deserializeBinaryFromReader(message: GetProfileResponse, reader: jspb.BinaryReader): GetProfileResponse;
}

export namespace GetProfileResponse {
  export type AsObject = {
    id: number,
    username: string,
    name: string,
    bio: string,
    avatarUrl: string,
    coverUrl: string,
  }
}

export class UpdateProfileRequest extends jspb.Message {
  getName(): string;
  setName(value: string): UpdateProfileRequest;

  getBio(): string;
  setBio(value: string): UpdateProfileRequest;

  getAvatarUrl(): string;
  setAvatarUrl(value: string): UpdateProfileRequest;

  getCoverUrl(): string;
  setCoverUrl(value: string): UpdateProfileRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateProfileRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateProfileRequest): UpdateProfileRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateProfileRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateProfileRequest;
  static deserializeBinaryFromReader(message: UpdateProfileRequest, reader: jspb.BinaryReader): UpdateProfileRequest;
}

export namespace UpdateProfileRequest {
  export type AsObject = {
    name: string,
    bio: string,
    avatarUrl: string,
    coverUrl: string,
  }
}

export class FollowRequest extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): FollowRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FollowRequest.AsObject;
  static toObject(includeInstance: boolean, msg: FollowRequest): FollowRequest.AsObject;
  static serializeBinaryToWriter(message: FollowRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FollowRequest;
  static deserializeBinaryFromReader(message: FollowRequest, reader: jspb.BinaryReader): FollowRequest;
}

export namespace FollowRequest {
  export type AsObject = {
    userId: number,
  }
}

export class UnfollowRequest extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): UnfollowRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnfollowRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UnfollowRequest): UnfollowRequest.AsObject;
  static serializeBinaryToWriter(message: UnfollowRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnfollowRequest;
  static deserializeBinaryFromReader(message: UnfollowRequest, reader: jspb.BinaryReader): UnfollowRequest;
}

export namespace UnfollowRequest {
  export type AsObject = {
    userId: number,
  }
}

export class GetFollowersRequest extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): GetFollowersRequest;

  getCursor(): number;
  setCursor(value: number): GetFollowersRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFollowersRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetFollowersRequest): GetFollowersRequest.AsObject;
  static serializeBinaryToWriter(message: GetFollowersRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFollowersRequest;
  static deserializeBinaryFromReader(message: GetFollowersRequest, reader: jspb.BinaryReader): GetFollowersRequest;
}

export namespace GetFollowersRequest {
  export type AsObject = {
    userId: number,
    cursor: number,
  }
}

export class GetFollowersResponse extends jspb.Message {
  getFollowersList(): Array<number>;
  setFollowersList(value: Array<number>): GetFollowersResponse;
  clearFollowersList(): GetFollowersResponse;
  addFollowers(value: number, index?: number): GetFollowersResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFollowersResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetFollowersResponse): GetFollowersResponse.AsObject;
  static serializeBinaryToWriter(message: GetFollowersResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFollowersResponse;
  static deserializeBinaryFromReader(message: GetFollowersResponse, reader: jspb.BinaryReader): GetFollowersResponse;
}

export namespace GetFollowersResponse {
  export type AsObject = {
    followersList: Array<number>,
  }
}

export class GetFollowingRequest extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): GetFollowingRequest;

  getCursor(): number;
  setCursor(value: number): GetFollowingRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFollowingRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetFollowingRequest): GetFollowingRequest.AsObject;
  static serializeBinaryToWriter(message: GetFollowingRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFollowingRequest;
  static deserializeBinaryFromReader(message: GetFollowingRequest, reader: jspb.BinaryReader): GetFollowingRequest;
}

export namespace GetFollowingRequest {
  export type AsObject = {
    userId: number,
    cursor: number,
  }
}

export class GetFollowingResponse extends jspb.Message {
  getFollowingList(): Array<number>;
  setFollowingList(value: Array<number>): GetFollowingResponse;
  clearFollowingList(): GetFollowingResponse;
  addFollowing(value: number, index?: number): GetFollowingResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetFollowingResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetFollowingResponse): GetFollowingResponse.AsObject;
  static serializeBinaryToWriter(message: GetFollowingResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetFollowingResponse;
  static deserializeBinaryFromReader(message: GetFollowingResponse, reader: jspb.BinaryReader): GetFollowingResponse;
}

export namespace GetFollowingResponse {
  export type AsObject = {
    followingList: Array<number>,
  }
}

export class SearchUserRequest extends jspb.Message {
  getQuery(): string;
  setQuery(value: string): SearchUserRequest;

  getCursor(): number;
  setCursor(value: number): SearchUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: SearchUserRequest): SearchUserRequest.AsObject;
  static serializeBinaryToWriter(message: SearchUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchUserRequest;
  static deserializeBinaryFromReader(message: SearchUserRequest, reader: jspb.BinaryReader): SearchUserRequest;
}

export namespace SearchUserRequest {
  export type AsObject = {
    query: string,
    cursor: number,
  }
}

export class SearchUserResponse extends jspb.Message {
  getUsersList(): Array<number>;
  setUsersList(value: Array<number>): SearchUserResponse;
  clearUsersList(): SearchUserResponse;
  addUsers(value: number, index?: number): SearchUserResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): SearchUserResponse.AsObject;
  static toObject(includeInstance: boolean, msg: SearchUserResponse): SearchUserResponse.AsObject;
  static serializeBinaryToWriter(message: SearchUserResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): SearchUserResponse;
  static deserializeBinaryFromReader(message: SearchUserResponse, reader: jspb.BinaryReader): SearchUserResponse;
}

export namespace SearchUserResponse {
  export type AsObject = {
    usersList: Array<number>,
  }
}

export class UploadImageRequest extends jspb.Message {
  getImage(): Uint8Array | string;
  getImage_asU8(): Uint8Array;
  getImage_asB64(): string;
  setImage(value: Uint8Array | string): UploadImageRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UploadImageRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UploadImageRequest): UploadImageRequest.AsObject;
  static serializeBinaryToWriter(message: UploadImageRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UploadImageRequest;
  static deserializeBinaryFromReader(message: UploadImageRequest, reader: jspb.BinaryReader): UploadImageRequest;
}

export namespace UploadImageRequest {
  export type AsObject = {
    image: Uint8Array | string,
  }
}

export class UploadImageResponse extends jspb.Message {
  getUrl(): string;
  setUrl(value: string): UploadImageResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UploadImageResponse.AsObject;
  static toObject(includeInstance: boolean, msg: UploadImageResponse): UploadImageResponse.AsObject;
  static serializeBinaryToWriter(message: UploadImageResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UploadImageResponse;
  static deserializeBinaryFromReader(message: UploadImageResponse, reader: jspb.BinaryReader): UploadImageResponse;
}

export namespace UploadImageResponse {
  export type AsObject = {
    url: string,
  }
}

export class CreatePostRequest extends jspb.Message {
  getContent(): string;
  setContent(value: string): CreatePostRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreatePostRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreatePostRequest): CreatePostRequest.AsObject;
  static serializeBinaryToWriter(message: CreatePostRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreatePostRequest;
  static deserializeBinaryFromReader(message: CreatePostRequest, reader: jspb.BinaryReader): CreatePostRequest;
}

export namespace CreatePostRequest {
  export type AsObject = {
    content: string,
  }
}

export class CreatePostResponse extends jspb.Message {
  getId(): number;
  setId(value: number): CreatePostResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreatePostResponse.AsObject;
  static toObject(includeInstance: boolean, msg: CreatePostResponse): CreatePostResponse.AsObject;
  static serializeBinaryToWriter(message: CreatePostResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreatePostResponse;
  static deserializeBinaryFromReader(message: CreatePostResponse, reader: jspb.BinaryReader): CreatePostResponse;
}

export namespace CreatePostResponse {
  export type AsObject = {
    id: number,
  }
}

export class GetPostRequest extends jspb.Message {
  getId(): number;
  setId(value: number): GetPostRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPostRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetPostRequest): GetPostRequest.AsObject;
  static serializeBinaryToWriter(message: GetPostRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPostRequest;
  static deserializeBinaryFromReader(message: GetPostRequest, reader: jspb.BinaryReader): GetPostRequest;
}

export namespace GetPostRequest {
  export type AsObject = {
    id: number,
  }
}

export class GetPostResponse extends jspb.Message {
  getId(): number;
  setId(value: number): GetPostResponse;

  getUsername(): string;
  setUsername(value: string): GetPostResponse;

  getContent(): string;
  setContent(value: string): GetPostResponse;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): GetPostResponse;
  hasCreatedAt(): boolean;
  clearCreatedAt(): GetPostResponse;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetPostResponse.AsObject;
  static toObject(includeInstance: boolean, msg: GetPostResponse): GetPostResponse.AsObject;
  static serializeBinaryToWriter(message: GetPostResponse, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetPostResponse;
  static deserializeBinaryFromReader(message: GetPostResponse, reader: jspb.BinaryReader): GetPostResponse;
}

export namespace GetPostResponse {
  export type AsObject = {
    id: number,
    username: string,
    content: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

