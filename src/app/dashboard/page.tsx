"use client";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import {
  Loader2,
  Plus,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  Copy,
  Check,
  Eye,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/authProvider";
import { useRouter } from "next/navigation";
import formatDate from "@/utils/formateDate";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { toast } from "sonner";
import { motion } from "framer-motion";

const PAGE_SIZE = 5;

export default function Dashboard() {
  const client = useQueryClient();
  const [newNote, setNewNote] = useState("");
  const [page, setPage] = useState(1);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [summarizing, setSummarizing] = useState<Record<string, boolean>>({});
  const [showPreview, setShowPreview] = useState(false);
  const [copiedNoteId, setCopiedNoteId] = useState<string | null>(null);
  const router = useRouter();
  const { user, loading } = useAuth();

  console.log(user);

  const offset = (page - 1) * PAGE_SIZE;

  const {
    data: notes,
    isLoading,
    isFetching,
  } = useQuery({
    queryKey: ["notes", user?.id, page],
    queryFn: async () => {
      const { data } = await supabase
        .from("notes")
        .select("id, content, created_at, updated_at")
        .eq("user_id", user?.id)
        .order("created_at", { ascending: false })
        .range(offset, offset + PAGE_SIZE - 1);
      return data;
    },
    enabled: !!user,
  });

  const { data: totalNotes } = useQuery({
    queryKey: ["notes-count", user?.id],
    queryFn: async () => {
      const { count } = await supabase
        .from("notes")
        .select("*", { count: "exact", head: true })
        .eq("user_id", user?.id);
      return count;
    },
    enabled: !!user,
  });

  const totalPages = totalNotes ? Math.ceil(totalNotes / PAGE_SIZE) : 1;

  const addNote = useMutation({
    mutationFn: async () => {
      await supabase
        .from("notes")
        .insert({ content: newNote, user_id: user.id });
    },
    onSuccess: () => {
      setNewNote("");
      toast.success("Note added successfully");
      client.invalidateQueries({ queryKey: ["notes-count"] });
      client.invalidateQueries({ queryKey: ["notes", user?.id, page] });
    },
    onError: () => {
      toast.error("Failed to add note");
    },
  });

  const summarize = async (noteId: string, content: string) => {
    try {
      setSummarizing((prev) => ({ ...prev, [noteId]: true }));
      const { data } = await axios.post("/api/sumarize", { content });

      setSummaries((prev) => ({ ...prev, [noteId]: data.summary }));
      toast.success("Note summarized successfully");
    } catch (err) {
      console.error("Summarize error:", err);
      toast.error("Failed to summarize note");
    } finally {
      setSummarizing((prev) => ({ ...prev, [noteId]: false }));
    }
  };

  const copyToClipboard = (content: string, noteId: string) => {
    navigator.clipboard.writeText(content);
    setCopiedNoteId(noteId);
    toast.success("Note copied to clipboard");
    setTimeout(() => setCopiedNoteId(null), 2000);
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, user]);

  if (loading || !user) return <p>Loading...</p>;

  return (
    <div className="min-h-screen bg-black text-zinc-200">
      <div className="max-w-3xl mx-auto p-4 space-y-6">
        <header className="border-b border-zinc-800 pb-4">
          <h1 className="text-2xl font-bold text-white">Notes</h1>
          <motion.p
            className="text-6xl mt-1 font-medium"
            animate={{
              backgroundImage: [
                "linear-gradient(90deg, #ff9a9e, #fad0c4, #fbc2eb, #a6c1ee, #a18cd1, #fbc2eb, #ff9a9e)",
                "linear-gradient(90deg, #a18cd1, #fbc2eb, #ff9a9e, #fad0c4, #fbc2eb, #a6c1ee, #a18cd1)",
              ],
              backgroundSize: "400% auto",
              backgroundClip: "text",
              WebkitBackgroundClip: "text",
              color: "transparent",
              textShadow: "0 0 8px rgba(255,255,255,0.3)",
            }}
            transition={{
              backgroundImage: {
                duration: 8,
                repeat: Infinity,
                ease: "linear",
              },
            }}
          >
            Welcome back, {user.email.slice(0, user.email.lastIndexOf("@"))}
          </motion.p>
        </header>

        <div className="bg-zinc-900 rounded-lg p-4 border border-zinc-800">
          {showPreview ? (
            <div className="bg-zinc-950 p-3 rounded-md prose prose-invert max-w-none text-sm">
              <ReactMarkdown remarkPlugins={[remarkGfm]}>
                {newNote}
              </ReactMarkdown>
            </div>
          ) : (
            <Textarea
              placeholder="Write a new note (supports Markdown)"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              className="w-full bg-zinc-950 border-zinc-800 text-zinc-200 placeholder:text-zinc-600 mb-3 min-h-[80px] text-sm"
            />
          )}
          <div className="flex gap-2 justify-end">
            <Button
              onClick={() => setShowPreview((prev) => !prev)}
              variant="outline"
              size="icon"
              className="bg-zinc-800 text-zinc-200 hover:bg-zinc-700 rounded-full h-8 w-8"
            >
              <Eye className="h-4 w-4" />
            </Button>
            <Button
              onClick={() => addNote.mutate()}
              disabled={!newNote || addNote.isPending}
              size="icon"
              className="text-black bg-white rounded-full h-8 w-8"
            >
              {addNote.isPending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Plus className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        <div className="space-y-3">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-4">
                  <Skeleton className="h-3 w-full bg-zinc-800 mb-2" />
                  <Skeleton className="h-3 w-3/4 bg-zinc-800 mb-2" />
                  <Skeleton className="h-3 w-1/2 bg-zinc-800" />
                </CardContent>
              </Card>
            ))
          ) : notes?.length === 0 ? (
            <div className="text-center py-8 bg-zinc-900 rounded-lg border border-zinc-800">
              <p className="text-zinc-400 text-sm">
                No notes yet. Start by adding one above.
              </p>
            </div>
          ) : (
            notes?.map((note: any) => (
              <Card
                key={note.id}
                className="bg-zinc-900 border-zinc-800 hover:border-zinc-700 transition-colors"
              >
                <CardContent className="p-2">
                  <div className="flex justify-between items-start">
                    <Badge
                      variant="outline"
                      className="bg-zinc-950 text-zinc-400 border-zinc-800 text-xs"
                    >
                      {formatDate(note.created_at)}
                    </Badge>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => copyToClipboard(note.content, note.id)}
                      className="text-zinc-400 hover:text-white hover:bg-zinc-800 p-1 h-6 w-6"
                    >
                      {copiedNoteId === note.id ? (
                        <Check className="h-3 w-3" />
                      ) : (
                        <Copy className="h-3 w-3" />
                      )}
                    </Button>
                  </div>
                  <div className="prose prose-invert max-w-none text-sm text-white px-2">
                    <ReactMarkdown remarkPlugins={[remarkGfm]}>
                      {note.content}
                    </ReactMarkdown>
                  </div>

                  {summaries[note.id] && (
                    <div className="mt-3 p-3 bg-zinc-950 rounded-md border border-zinc-800 text-xs">
                      <h4 className="font-medium text-zinc-400 mb-1">
                        Summary
                      </h4>
                      <div className="text-zinc-300">{summaries[note.id]}</div>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-zinc-950 px-4 py-2 border-t border-zinc-800 flex justify-end">
                  <Button
                    onClick={() => summarize(note.id, note.content)}
                    variant="ghost"
                    size="sm"
                    disabled={summarizing[note.id]}
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800 text-xs h-7"
                  >
                    {summarizing[note.id] ? (
                      <>
                        <Loader2 className="h-3 w-3 mr-1 animate-spin" />
                        Summarizing...
                      </>
                    ) : summaries[note.id] ? (
                      <>
                        <RefreshCw className="h-3 w-3 mr-1" />
                        Regenerate
                      </>
                    ) : (
                      "Summarize"
                    )}
                  </Button>
                </CardFooter>
              </Card>
            ))
          )}

          {isFetching && !isLoading && (
            <div className="flex justify-center py-3">
              <Loader2 className="h-5 w-5 animate-spin text-zinc-500" />
            </div>
          )}
        </div>

        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-4 border-t border-zinc-800">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              size="sm"
              className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white text-xs"
            >
              <ChevronLeft className="h-3 w-3 mr-1" />
              Prev
            </Button>
            <span className="text-xs text-zinc-500">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              size="sm"
              className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white text-xs"
            >
              Next
              <ChevronRight className="h-3 w-3 ml-1" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
