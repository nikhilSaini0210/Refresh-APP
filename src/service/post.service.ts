import {
  getFirestore,
  collection,
  doc,
  setDoc,
  getDocs,
  query,
  where,
  orderBy,
  getDoc,
  updateDoc,
  deleteDoc,
  serverTimestamp,
} from '@react-native-firebase/firestore';
import {uploadToS3} from './uploadToS3';
import {CollectionsType} from './config';
import {Asset} from 'react-native-image-picker';

export interface Like {
  userId: string;
}

export interface Comment {
  userId: string;
  comment: string;
  commentId: string;
  timestamp: string;
  userName: string;
  profileUri: string;
  postId: string;
}

export interface Post {
  id: string;
  imageUrl: string;
  caption: string;
  userName: string;
  userEmail: string;
  userId: string;
  createdAt: any;
  updatedAt: any;
  likes?: Like[];
  comments?: Comment[];
}

class PostService {
  private db = getFirestore();
  // Create a new post
  async createPost(
    imageData: Asset,
    caption: string,
    userName: string,
    userEmail: string,
    userId: string,
  ): Promise<Post> {
    try {
      // Upload image to S3
      const imageUrl = await uploadToS3(
        imageData.uri ?? '',
        imageData.fileName,
        imageData.type,
      );

      // Create post document in Firestore
      const postsRef = collection(this.db, CollectionsType.Posts);
      const newPostRef = doc(postsRef);
      const postId = newPostRef.id;

      const postData: Post = {
        id: postId,
        imageUrl,
        caption,
        userName,
        userEmail,
        userId,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        comments: [],
        likes: [],
      };

      await setDoc(newPostRef, postData);

      return postData;
    } catch (error) {
      console.error('Error creating post:', error);
      throw error;
    }
  }

  // Get all posts
  async getAllPosts(): Promise<Post[]> {
    try {
      const postsRef = collection(this.db, CollectionsType.Posts);
      const q = query(postsRef, orderBy('createdAt', 'desc'));
      const snapshot = await getDocs(q);

      return snapshot.docs.map(document => document.data() as Post);
    } catch (error) {
      console.error('Error getting posts:', error);
      throw error;
    }
  }

  // Get posts by user ID
  async getPostsByUserId(userId: string): Promise<Post[]> {
    try {
      const postsRef = collection(this.db, CollectionsType.Posts);
      const q = query(
        postsRef,
        where('userId', '==', userId),
        orderBy('createdAt', 'desc'),
      );
      const snapshot = await getDocs(q);

      return snapshot.docs.map(document => document.data() as Post);
    } catch (error) {
      console.error('Error getting user posts:', error);
      throw error;
    }
  }

  // Get a single post by ID
  async getPostById(postId: string): Promise<Post | null> {
    try {
      const postsRef = collection(this.db, CollectionsType.Posts);
      const postRef = doc(postsRef, postId);
      const postDoc = await getDoc(postRef);

      if (postDoc.exists) {
        return postDoc.data() as Post;
      }
      return null;
    } catch (error) {
      console.error('Error getting post:', error);
      throw error;
    }
  }

  // Update a post
  async updatePost(postId: string, updates: Partial<Post>): Promise<void> {
    try {
      const postsRef = collection(this.db, CollectionsType.Posts);
      const postRef = doc(postsRef, postId);
      await updateDoc(postRef, {
        ...updates,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error updating post:', error);
      throw error;
    }
  }

  // Delete a post
  async deletePost(postId: string): Promise<void> {
    try {
      const postsRef = collection(this.db, CollectionsType.Posts);
      const postRef = doc(postsRef, postId);
      await deleteDoc(postRef);
    } catch (error) {
      console.error('Error deleting post:', error);
      throw error;
    }
  }

  async addComment(postId: string, newComment: Comment): Promise<void> {
    try {
      const postsRef = collection(this.db, CollectionsType.Posts);
      const postRef = doc(postsRef, postId);

      const postDoc = await getDoc(postRef);
      if (!postDoc.exists) {
        throw new Error('Post not found');
      }

      const postData = postDoc.data() as Post;

      const updatedComments = [...(postData.comments || []), newComment];

      await updateDoc(postRef, {
        comments: updatedComments,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('Error adding comment:', error);
      throw error;
    }
  }

  async getCommentsByPostId(postId: string): Promise<Comment[]> {
    try {
      const postsRef = collection(this.db, CollectionsType.Posts);
      const postRef = doc(postsRef, postId);

      const postDoc = await getDoc(postRef);
      if (!postDoc.exists) {
        throw new Error('Post not found');
      }

      const postData = postDoc.data() as Post;
      return postData.comments || [];
    } catch (error) {
      console.error('Error getting comments for post:', error);
      throw error;
    }
  }

  async deleteComment(postId: string, commentId: string) {
    try {
      const post = await this.getPostById(postId);
      if (post) {
        const updatedComments = post.comments?.filter(
          comment => comment.commentId !== commentId,
        );
        await this.updatePost(postId, {...post, comments: updatedComments});
        return true;
      }
      return false;
    } catch (error) {
      console.error('Error deleting comment:', error);
      return false;
    }
  }
}

export default new PostService();
