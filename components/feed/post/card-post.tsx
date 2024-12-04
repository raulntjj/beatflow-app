import {
  Card,
  CardContent,
  CardFooter,
  CardHeader
} from "@/components/ui/card";
import { Bookmark, Heart, MessageCircle, Send } from 'lucide-react';
import Image from 'next/image';
import React from 'react';
import { Skeleton } from '../../ui/skeleton';

interface PostProps {
  username: string;
  userAvatar: string;
  postImage: string;
  likes: number;
  caption: string;
  isLoading?: boolean;
}

export const CardPost: React.FC<PostProps> = ({
  username,
  userAvatar,
  postImage,
  likes,
  caption,
  isLoading = false
}) => {
  if (isLoading) {
    return <PostSkeleton />;
  }

  return (
    <Card className="max-w-md mx-auto border-none shadow-none">
      {/* Header */}
      <CardHeader className="flex flex-row items-center space-x-3 p-4">
        <Image 
          src={userAvatar} 
          alt={`${username} avatar`} 
          width={40} 
          height={40} 
          className="rounded-full"
        />
        <div className="flex-1">
          <p className="font-semibold text-sm">{username}</p>
        </div>
      </CardHeader>

      {/* Post Image */}
      <CardContent className="p-0">
        <Image 
          src={postImage} 
          alt="Post image" 
          width={1440} 
          height={1800} 
          className="w-full h-auto object-cover"
        />
      </CardContent>

      {/* Actions and Likes */}
      <CardFooter className="p-4 flex flex-col space-y-2">
        <div className="flex justify-between w-full mb-2">
          <div className="flex space-x-4">
            <Heart className="cursor-pointer" />
            <MessageCircle className="cursor-pointer" />
            <Send className="cursor-pointer" />
          </div>
          <Bookmark className="cursor-pointer" />
        </div>
        
        <div>
          <p className="font-semibold text-sm">{likes} likes</p>
          <p className="text-sm">
            <span className="font-semibold mr-1">{username}</span>
            {caption}
          </p>
        </div>
      </CardFooter>
    </Card>
  );
};

const PostSkeleton: React.FC = () => {
  return (
    <Card className="max-w-md mx-auto border-none shadow-none">
      {/* Header Skeleton */}
      <CardHeader className="flex flex-row items-center space-x-3 p-4">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-4 w-24" />
      </CardHeader>

      {/* Image Skeleton */}
      <Skeleton className="w-full h-[500px]" />

      {/* Actions Skeleton */}
      <CardFooter className="p-4 flex flex-col space-y-2">
        <div className="flex justify-between w-full mb-2">
          <div className="flex space-x-4">
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-6" />
            <Skeleton className="h-6 w-6" />
          </div>
          <Skeleton className="h-6 w-6" />
        </div>
        
        <div className="space-y-2">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </CardFooter>
    </Card>
  );
};

export default CardPost