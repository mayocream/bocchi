import * as jspb from 'google-protobuf'

import * as google_protobuf_timestamp_pb from 'google-protobuf/google/protobuf/timestamp_pb'; // proto import: "google/protobuf/timestamp.proto"
import * as google_protobuf_empty_pb from 'google-protobuf/google/protobuf/empty_pb'; // proto import: "google/protobuf/empty.proto"


export class User extends jspb.Message {
  getId(): number;
  setId(value: number): User;

  getUid(): string;
  setUid(value: string): User;

  getEmail(): string;
  setEmail(value: string): User;

  getEmailVerified(): boolean;
  setEmailVerified(value: boolean): User;

  getUsername(): string;
  setUsername(value: string): User;

  getName(): string;
  setName(value: string): User;

  getBio(): string;
  setBio(value: string): User;

  getAvatarUrl(): string;
  setAvatarUrl(value: string): User;

  getCoverUrl(): string;
  setCoverUrl(value: string): User;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): User;
  hasCreatedAt(): boolean;
  clearCreatedAt(): User;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): User;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): User;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): User.AsObject;
  static toObject(includeInstance: boolean, msg: User): User.AsObject;
  static serializeBinaryToWriter(message: User, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): User;
  static deserializeBinaryFromReader(message: User, reader: jspb.BinaryReader): User;
}

export namespace User {
  export type AsObject = {
    id: number,
    uid: string,
    email: string,
    emailVerified: boolean,
    username: string,
    name: string,
    bio: string,
    avatarUrl: string,
    coverUrl: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class CreateUserRequest extends jspb.Message {
  getUid(): string;
  setUid(value: string): CreateUserRequest;

  getEmail(): string;
  setEmail(value: string): CreateUserRequest;

  getUsername(): string;
  setUsername(value: string): CreateUserRequest;

  getName(): string;
  setName(value: string): CreateUserRequest;

  getBio(): string;
  setBio(value: string): CreateUserRequest;

  getAvatarUrl(): string;
  setAvatarUrl(value: string): CreateUserRequest;

  getCoverUrl(): string;
  setCoverUrl(value: string): CreateUserRequest;

  getEmailVerified(): boolean;
  setEmailVerified(value: boolean): CreateUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateUserRequest): CreateUserRequest.AsObject;
  static serializeBinaryToWriter(message: CreateUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateUserRequest;
  static deserializeBinaryFromReader(message: CreateUserRequest, reader: jspb.BinaryReader): CreateUserRequest;
}

export namespace CreateUserRequest {
  export type AsObject = {
    uid: string,
    email: string,
    username: string,
    name: string,
    bio: string,
    avatarUrl: string,
    coverUrl: string,
    emailVerified: boolean,
  }
}

export class GetUserRequest extends jspb.Message {
  getId(): number;
  setId(value: number): GetUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetUserRequest): GetUserRequest.AsObject;
  static serializeBinaryToWriter(message: GetUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetUserRequest;
  static deserializeBinaryFromReader(message: GetUserRequest, reader: jspb.BinaryReader): GetUserRequest;
}

export namespace GetUserRequest {
  export type AsObject = {
    id: number,
  }
}

export class UpdateUserRequest extends jspb.Message {
  getId(): number;
  setId(value: number): UpdateUserRequest;

  getName(): string;
  setName(value: string): UpdateUserRequest;

  getBio(): string;
  setBio(value: string): UpdateUserRequest;

  getAvatarUrl(): string;
  setAvatarUrl(value: string): UpdateUserRequest;

  getCoverUrl(): string;
  setCoverUrl(value: string): UpdateUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdateUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdateUserRequest): UpdateUserRequest.AsObject;
  static serializeBinaryToWriter(message: UpdateUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdateUserRequest;
  static deserializeBinaryFromReader(message: UpdateUserRequest, reader: jspb.BinaryReader): UpdateUserRequest;
}

export namespace UpdateUserRequest {
  export type AsObject = {
    id: number,
    name: string,
    bio: string,
    avatarUrl: string,
    coverUrl: string,
  }
}

export class DeleteUserRequest extends jspb.Message {
  getId(): number;
  setId(value: number): DeleteUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteUserRequest): DeleteUserRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteUserRequest;
  static deserializeBinaryFromReader(message: DeleteUserRequest, reader: jspb.BinaryReader): DeleteUserRequest;
}

export namespace DeleteUserRequest {
  export type AsObject = {
    id: number,
  }
}

export class Post extends jspb.Message {
  getId(): number;
  setId(value: number): Post;

  getUserId(): number;
  setUserId(value: number): Post;

  getContent(): string;
  setContent(value: string): Post;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Post;
  hasCreatedAt(): boolean;
  clearCreatedAt(): Post;

  getUpdatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setUpdatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Post;
  hasUpdatedAt(): boolean;
  clearUpdatedAt(): Post;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Post.AsObject;
  static toObject(includeInstance: boolean, msg: Post): Post.AsObject;
  static serializeBinaryToWriter(message: Post, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Post;
  static deserializeBinaryFromReader(message: Post, reader: jspb.BinaryReader): Post;
}

export namespace Post {
  export type AsObject = {
    id: number,
    userId: number,
    content: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
    updatedAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class CreatePostRequest extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): CreatePostRequest;

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
    userId: number,
    content: string,
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

export class UpdatePostRequest extends jspb.Message {
  getId(): number;
  setId(value: number): UpdatePostRequest;

  getContent(): string;
  setContent(value: string): UpdatePostRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UpdatePostRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UpdatePostRequest): UpdatePostRequest.AsObject;
  static serializeBinaryToWriter(message: UpdatePostRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UpdatePostRequest;
  static deserializeBinaryFromReader(message: UpdatePostRequest, reader: jspb.BinaryReader): UpdatePostRequest;
}

export namespace UpdatePostRequest {
  export type AsObject = {
    id: number,
    content: string,
  }
}

export class DeletePostRequest extends jspb.Message {
  getId(): number;
  setId(value: number): DeletePostRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeletePostRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeletePostRequest): DeletePostRequest.AsObject;
  static serializeBinaryToWriter(message: DeletePostRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeletePostRequest;
  static deserializeBinaryFromReader(message: DeletePostRequest, reader: jspb.BinaryReader): DeletePostRequest;
}

export namespace DeletePostRequest {
  export type AsObject = {
    id: number,
  }
}

export class Comment extends jspb.Message {
  getId(): number;
  setId(value: number): Comment;

  getPostId(): number;
  setPostId(value: number): Comment;

  getUserId(): number;
  setUserId(value: number): Comment;

  getContent(): string;
  setContent(value: string): Comment;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Comment;
  hasCreatedAt(): boolean;
  clearCreatedAt(): Comment;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Comment.AsObject;
  static toObject(includeInstance: boolean, msg: Comment): Comment.AsObject;
  static serializeBinaryToWriter(message: Comment, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Comment;
  static deserializeBinaryFromReader(message: Comment, reader: jspb.BinaryReader): Comment;
}

export namespace Comment {
  export type AsObject = {
    id: number,
    postId: number,
    userId: number,
    content: string,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class CreateCommentRequest extends jspb.Message {
  getPostId(): number;
  setPostId(value: number): CreateCommentRequest;

  getUserId(): number;
  setUserId(value: number): CreateCommentRequest;

  getContent(): string;
  setContent(value: string): CreateCommentRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): CreateCommentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: CreateCommentRequest): CreateCommentRequest.AsObject;
  static serializeBinaryToWriter(message: CreateCommentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): CreateCommentRequest;
  static deserializeBinaryFromReader(message: CreateCommentRequest, reader: jspb.BinaryReader): CreateCommentRequest;
}

export namespace CreateCommentRequest {
  export type AsObject = {
    postId: number,
    userId: number,
    content: string,
  }
}

export class GetCommentRequest extends jspb.Message {
  getId(): number;
  setId(value: number): GetCommentRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetCommentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetCommentRequest): GetCommentRequest.AsObject;
  static serializeBinaryToWriter(message: GetCommentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetCommentRequest;
  static deserializeBinaryFromReader(message: GetCommentRequest, reader: jspb.BinaryReader): GetCommentRequest;
}

export namespace GetCommentRequest {
  export type AsObject = {
    id: number,
  }
}

export class DeleteCommentRequest extends jspb.Message {
  getId(): number;
  setId(value: number): DeleteCommentRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): DeleteCommentRequest.AsObject;
  static toObject(includeInstance: boolean, msg: DeleteCommentRequest): DeleteCommentRequest.AsObject;
  static serializeBinaryToWriter(message: DeleteCommentRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): DeleteCommentRequest;
  static deserializeBinaryFromReader(message: DeleteCommentRequest, reader: jspb.BinaryReader): DeleteCommentRequest;
}

export namespace DeleteCommentRequest {
  export type AsObject = {
    id: number,
  }
}

export class LikePostRequest extends jspb.Message {
  getPostId(): number;
  setPostId(value: number): LikePostRequest;

  getUserId(): number;
  setUserId(value: number): LikePostRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): LikePostRequest.AsObject;
  static toObject(includeInstance: boolean, msg: LikePostRequest): LikePostRequest.AsObject;
  static serializeBinaryToWriter(message: LikePostRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): LikePostRequest;
  static deserializeBinaryFromReader(message: LikePostRequest, reader: jspb.BinaryReader): LikePostRequest;
}

export namespace LikePostRequest {
  export type AsObject = {
    postId: number,
    userId: number,
  }
}

export class UnlikePostRequest extends jspb.Message {
  getPostId(): number;
  setPostId(value: number): UnlikePostRequest;

  getUserId(): number;
  setUserId(value: number): UnlikePostRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnlikePostRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UnlikePostRequest): UnlikePostRequest.AsObject;
  static serializeBinaryToWriter(message: UnlikePostRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnlikePostRequest;
  static deserializeBinaryFromReader(message: UnlikePostRequest, reader: jspb.BinaryReader): UnlikePostRequest;
}

export namespace UnlikePostRequest {
  export type AsObject = {
    postId: number,
    userId: number,
  }
}

export class FollowUserRequest extends jspb.Message {
  getFollowerId(): number;
  setFollowerId(value: number): FollowUserRequest;

  getFollowingId(): number;
  setFollowingId(value: number): FollowUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): FollowUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: FollowUserRequest): FollowUserRequest.AsObject;
  static serializeBinaryToWriter(message: FollowUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): FollowUserRequest;
  static deserializeBinaryFromReader(message: FollowUserRequest, reader: jspb.BinaryReader): FollowUserRequest;
}

export namespace FollowUserRequest {
  export type AsObject = {
    followerId: number,
    followingId: number,
  }
}

export class UnfollowUserRequest extends jspb.Message {
  getFollowerId(): number;
  setFollowerId(value: number): UnfollowUserRequest;

  getFollowingId(): number;
  setFollowingId(value: number): UnfollowUserRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): UnfollowUserRequest.AsObject;
  static toObject(includeInstance: boolean, msg: UnfollowUserRequest): UnfollowUserRequest.AsObject;
  static serializeBinaryToWriter(message: UnfollowUserRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): UnfollowUserRequest;
  static deserializeBinaryFromReader(message: UnfollowUserRequest, reader: jspb.BinaryReader): UnfollowUserRequest;
}

export namespace UnfollowUserRequest {
  export type AsObject = {
    followerId: number,
    followingId: number,
  }
}

export class RepostPostRequest extends jspb.Message {
  getPostId(): number;
  setPostId(value: number): RepostPostRequest;

  getUserId(): number;
  setUserId(value: number): RepostPostRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RepostPostRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RepostPostRequest): RepostPostRequest.AsObject;
  static serializeBinaryToWriter(message: RepostPostRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RepostPostRequest;
  static deserializeBinaryFromReader(message: RepostPostRequest, reader: jspb.BinaryReader): RepostPostRequest;
}

export namespace RepostPostRequest {
  export type AsObject = {
    postId: number,
    userId: number,
  }
}

export class RemoveRepostRequest extends jspb.Message {
  getPostId(): number;
  setPostId(value: number): RemoveRepostRequest;

  getUserId(): number;
  setUserId(value: number): RemoveRepostRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): RemoveRepostRequest.AsObject;
  static toObject(includeInstance: boolean, msg: RemoveRepostRequest): RemoveRepostRequest.AsObject;
  static serializeBinaryToWriter(message: RemoveRepostRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): RemoveRepostRequest;
  static deserializeBinaryFromReader(message: RemoveRepostRequest, reader: jspb.BinaryReader): RemoveRepostRequest;
}

export namespace RemoveRepostRequest {
  export type AsObject = {
    postId: number,
    userId: number,
  }
}

export class Notification extends jspb.Message {
  getId(): number;
  setId(value: number): Notification;

  getPostId(): number;
  setPostId(value: number): Notification;

  getUserId(): number;
  setUserId(value: number): Notification;

  getFromUserId(): number;
  setFromUserId(value: number): Notification;

  getType(): string;
  setType(value: string): Notification;

  getRead(): boolean;
  setRead(value: boolean): Notification;

  getCreatedAt(): google_protobuf_timestamp_pb.Timestamp | undefined;
  setCreatedAt(value?: google_protobuf_timestamp_pb.Timestamp): Notification;
  hasCreatedAt(): boolean;
  clearCreatedAt(): Notification;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): Notification.AsObject;
  static toObject(includeInstance: boolean, msg: Notification): Notification.AsObject;
  static serializeBinaryToWriter(message: Notification, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): Notification;
  static deserializeBinaryFromReader(message: Notification, reader: jspb.BinaryReader): Notification;
}

export namespace Notification {
  export type AsObject = {
    id: number,
    postId: number,
    userId: number,
    fromUserId: number,
    type: string,
    read: boolean,
    createdAt?: google_protobuf_timestamp_pb.Timestamp.AsObject,
  }
}

export class GetNotificationsRequest extends jspb.Message {
  getUserId(): number;
  setUserId(value: number): GetNotificationsRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): GetNotificationsRequest.AsObject;
  static toObject(includeInstance: boolean, msg: GetNotificationsRequest): GetNotificationsRequest.AsObject;
  static serializeBinaryToWriter(message: GetNotificationsRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): GetNotificationsRequest;
  static deserializeBinaryFromReader(message: GetNotificationsRequest, reader: jspb.BinaryReader): GetNotificationsRequest;
}

export namespace GetNotificationsRequest {
  export type AsObject = {
    userId: number,
  }
}

export class NotificationList extends jspb.Message {
  getNotificationsList(): Array<Notification>;
  setNotificationsList(value: Array<Notification>): NotificationList;
  clearNotificationsList(): NotificationList;
  addNotifications(value?: Notification, index?: number): Notification;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): NotificationList.AsObject;
  static toObject(includeInstance: boolean, msg: NotificationList): NotificationList.AsObject;
  static serializeBinaryToWriter(message: NotificationList, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): NotificationList;
  static deserializeBinaryFromReader(message: NotificationList, reader: jspb.BinaryReader): NotificationList;
}

export namespace NotificationList {
  export type AsObject = {
    notificationsList: Array<Notification.AsObject>,
  }
}

export class MarkNotificationAsReadRequest extends jspb.Message {
  getNotificationId(): number;
  setNotificationId(value: number): MarkNotificationAsReadRequest;

  serializeBinary(): Uint8Array;
  toObject(includeInstance?: boolean): MarkNotificationAsReadRequest.AsObject;
  static toObject(includeInstance: boolean, msg: MarkNotificationAsReadRequest): MarkNotificationAsReadRequest.AsObject;
  static serializeBinaryToWriter(message: MarkNotificationAsReadRequest, writer: jspb.BinaryWriter): void;
  static deserializeBinary(bytes: Uint8Array): MarkNotificationAsReadRequest;
  static deserializeBinaryFromReader(message: MarkNotificationAsReadRequest, reader: jspb.BinaryReader): MarkNotificationAsReadRequest;
}

export namespace MarkNotificationAsReadRequest {
  export type AsObject = {
    notificationId: number,
  }
}

