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
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { useAuth } from "@/components/authProvider";
import { useRouter } from "next/navigation";
import formatDate from "@/utils/formateDate";

const PAGE_SIZE = 5;

export default function Dashboard() {
  const client = useQueryClient();

  const [newNote, setNewNote] = useState("");
  const [page, setPage] = useState(1);
  const [summaries, setSummaries] = useState<Record<string, string>>({});
  const [summarizing, setSummarizing] = useState<Record<string, boolean>>({});
  const router = useRouter();
  const { user, loading } = useAuth();

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
      client.invalidateQueries({ queryKey: ["notes-count"] });
      client.invalidateQueries({ queryKey: ["notes", user?.id, page] });
    },
  });

  // Function to summarize the note
  const summarize = async (noteId: string, content: string) => {
    try {
      setSummarizing((prev) => ({ ...prev, [noteId]: true }));
      const { data } = await axios.post("/api/sumarize", { content });

      setSummaries((prev) => ({ ...prev, [noteId]: data.summary }));
    } catch (err) {
      console.error("Summarize error:", err);
    } finally {
      setSummarizing((prev) => ({ ...prev, [noteId]: false }));
    }
  };

  useEffect(() => {
    if (!loading && !user) {
      router.push("/");
    }
  }, [loading, user]);

  if (loading || !user) return <p>loading....</p>;

  return (
    <div className="min-h-screen bg-black text-zinc-200">
      <div className="max-w-3xl mx-auto p-6 space-y-8">
        <header className="border-b border-zinc-800 pb-6">
          <h1 className="text-3xl font-bold text-white">Notes</h1>
          <p className="text-zinc-400 mt-2">Welcome back, {user.email}</p>
        </header>

        <div className="bg-zinc-900 rounded-xl p-5 border border-zinc-800">
          <Textarea
            placeholder="Write a new note..."
            value={newNote}
            onChange={(e) => setNewNote(e.target.value)}
            className="w-full bg-zinc-950 border-zinc-800 text-zinc-200 placeholder:text-zinc-600 mb-3 min-h-[100px]"
          />
          <Button
            onClick={() => addNote.mutate()}
            disabled={!newNote || addNote.isPending}
            className="w-full bg-zinc-100 text-black hover:bg-zinc-200 flex items-center justify-center gap-2"
          >
            {addNote.isPending ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Adding...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add Note
              </>
            )}
          </Button>
        </div>

        <div className="space-y-4">
          {isLoading ? (
            Array.from({ length: 3 }).map((_, i) => (
              <Card key={i} className="bg-zinc-900 border-zinc-800">
                <CardContent className="p-5">
                  <Skeleton className="h-4 w-full bg-zinc-800 mb-2" />
                  <Skeleton className="h-4 w-3/4 bg-zinc-800 mb-2" />
                  <Skeleton className="h-4 w-1/2 bg-zinc-800" />
                </CardContent>
              </Card>
            ))
          ) : notes?.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900 rounded-xl border border-zinc-800">
              <p className="text-zinc-400">
                No notes yet. Start by adding one above.
              </p>
            </div>
          ) : (
            notes?.map((note: any) => (
              <Card
                key={note.id}
                className="bg-zinc-900 border-zinc-800 overflow-hidden"
              >
                <CardContent className="p-5 space-y-3">
                  <div className="flex justify-between items-start">
                    <Badge
                      variant="outline"
                      className="bg-zinc-950 text-zinc-400 border-zinc-800"
                    >
                      {formatDate(note.created_at)}
                    </Badge>
                  </div>
                  <p className="text-zinc-200 whitespace-pre-wrap">
                    {note.content}
                  </p>

                  {summaries[note.id] && (
                    <div className="mt-4 p-4 bg-zinc-950 rounded-lg border border-zinc-800">
                      <h4 className="text-sm font-medium text-zinc-400 mb-2">
                        Summary
                      </h4>
                      <p className="text-zinc-300 text-sm">
                        {summaries[note.id]}
                      </p>
                    </div>
                  )}
                </CardContent>
                <CardFooter className="bg-zinc-950 px-5 py-3 border-t border-zinc-800">
                  <Button
                    onClick={() => summarize(note.id, note.content)}
                    variant="ghost"
                    size="sm"
                    disabled={summarizing[note.id]}
                    className="text-zinc-400 hover:text-white hover:bg-zinc-800"
                  >
                    {summarizing[note.id] ? (
                      <>
                        <Loader2 className="h-3.5 w-3.5 mr-2 animate-spin" />
                        Summarizing...
                      </>
                    ) : summaries[note.id] ? (
                      <>
                        <RefreshCw className="h-3.5 w-3.5 mr-2" />
                        Regenerate Summary
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
            <div className="flex justify-center py-4">
              <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center pt-6 border-t border-zinc-800">
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.max(1, prev - 1))}
              disabled={page === 1}
              className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              <ChevronLeft className="h-4 w-4 mr-2" />
              Previous
            </Button>
            <span className="text-sm text-zinc-500">
              Page {page} of {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setPage((prev) => Math.min(totalPages, prev + 1))}
              disabled={page === totalPages}
              className="bg-zinc-900 border-zinc-800 text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
