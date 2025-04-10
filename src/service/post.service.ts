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

export interface Post {
  id: string;
  imageUrl: string;
  caption: string;
  userName: string;
  userEmail: string;
  userId: string;
  createdAt: any;
  updatedAt: any;
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
}

export default new PostService();
