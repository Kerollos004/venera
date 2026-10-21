

"use client"; 

import React, { useState, useEffect } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger
} from "@/components/ui/drawer";
import { useSelectedCommentContext, useThemeContext } from "../assets/contexts";
import Comment from "./Comment";
import { CommentType } from "../assets/assets";
import { supabase } from '../assets/supabase-client';

export default function PostComments({ postId }: { postId: string }) {
    const { selectedComment, setSelectedComment } = useSelectedCommentContext();
    const { mode } = useThemeContext();

    const [comments, setComments] = useState<CommentType[]>([]);
    const [loading, setLoading] = useState(false);

    const isOpen = selectedComment === postId;

    useEffect(() => {
        if (isOpen) {
            const fetchComments = async () => {
                setLoading(true);
                const { data, error } = await supabase
                    .from("comments")
                    .select("*")
                    .eq("post_id", postId);

                if (error) {
                    console.log("Error fetching comments:", error.message);
                } else {
                    setComments(data || []);
                }
                setLoading(false);
            };

            fetchComments();
        }
    }, [isOpen, postId]);

    const commentsMap = comments.map((comment) => (
        <Comment 
            comment={comment} 
            key={comment?.id} 
        />
    ));

    return (
        <Drawer 
            open={isOpen} 
            onOpenChange={(open) => setSelectedComment(open ? postId : "")}
        >
            <DrawerContent className={`overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden h-[50vh] ${mode === "light" ? "bg-gray-300 text-black" : "bg-gray-800 text-white"}`}>
                <div className="flex justify-center my-2.5">
                    <DrawerTrigger className="w-2/5 h-2 rounded-lg bg-blue-300"></DrawerTrigger>
                </div>
                <DrawerHeader>
                    <DrawerTitle className="mb-2.5 capitalize text-center text-3xl text-blue-600">
                        all comments
                    </DrawerTitle>
                </DrawerHeader>
                <div className="p-4 overflow-y-auto [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                    {loading ? (
                        <p className="text-center text-blue-400 capitalize">Loading comments...</p>
                    ) : comments.length > 0 ? (
                        commentsMap
                    ) : (
                        <p className="text-center text-gray-400 capitalize">no comments yet</p>
                    )}
                </div>
            </DrawerContent>
        </Drawer>
    );
}