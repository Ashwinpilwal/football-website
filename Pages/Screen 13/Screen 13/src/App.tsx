import { useEffect } from "react";
import {
  AlertCircle,
  BadgeCheck,
  Balloon,
  CircleDot,
  Heart,
  Image,
  LoaderCircle,
  MessageCircle,
  MoreHorizontal,
  Move,
  Play,
  Plus,
  Share2,
  Upload,
  X,
} from "lucide-react";

export default function App() {
  return (
    <div>
      <div className="min-h-screen bg-neutral-950 text-neutral-50 w-full h-fit overflow-hidden h-fit min-h-screen w-screen min-w-screen max-w-screen overflow-visible">
        <div className="relative min-h-screen bg-white/6">
          <div className="pointer-events-none opacity-30 bg-white/3 absolute inset-0" />
          <div className="pointer-events-none opacity-40 bg-white/8 absolute inset-x-0 top-0 h-40" />
          <div className="min-h-screen max-w-[1140px] flex mx-auto p-8 flex-col w-full">
            <div className="flex justify-between items-start gap-6">
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="size-11 shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_20px_60px_rgba(0,0,0,0.45)] rounded-2xl bg-neutral-900 border-white/10 border-1 border-solid flex justify-center items-center">
                    <Plus className="size-5 text-neutral-200" />
                  </div>
                  <div>
                    <div className="font-semibold text-2xl leading-8 tracking-tight">
                      Create Post
                    </div>
                    <div className="text-[#a1a1a1] text-sm leading-5">
                      Share what's happening on the pitch.
                    </div>
                  </div>
                </div>
              </div>
              <div className="shadow-sm rounded-full bg-neutral-900 text-[#a1a1a1] text-sm leading-5 border-white/10 border-1 border-solid flex px-4 py-2 items-center gap-2">
                <Image className="size-4 text-neutral-200" />
                <span>Draft autosaved</span>
              </div>
            </div>
            <div className="grid grid-cols-[minmax(0,1.35fr)_minmax(320px,0.95fr)] mt-8 flex-1 gap-6">
              <div className="flex flex-col gap-6">
                <div className="shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900 border-neutral-200/40 border-1 border-dashed p-6">
                  <div className="flex justify-between items-center gap-4">
                    <div className="flex items-center gap-3">
                      <div className="size-12 rounded-2xl bg-neutral-950/60 border-white/10 border-1 border-solid flex justify-center items-center">
                        <Balloon className="size-5 text-neutral-200" />
                      </div>
                      <div>
                        <div className="font-medium text-base leading-6">
                          Drag and drop media here
                        </div>
                        <div className="text-[#a1a1a1] text-sm leading-5">
                          Upload multiple images or videos from your latest
                          match, turf visit, or football discussion.
                        </div>
                      </div>
                    </div>
                    <div className="font-medium rounded-full bg-neutral-200/10 text-neutral-200 text-xs leading-4 border-neutral-200/30 border-1 border-solid px-3 py-1">
                      3 files
                    </div>
                  </div>
                  <div className="rounded-2xl bg-neutral-950/40 border-neutral-200/30 border-1 border-dashed mt-5 p-8">
                    <div className="text-center flex flex-col justify-center items-center gap-3">
                      <div className="size-16 shadow-[0_0_40px_rgba(255,255,255,0.04)] rounded-full bg-neutral-900 border-neutral-200/30 border-1 border-solid flex justify-center items-center">
                        <CircleDot className="size-7 text-neutral-200" />
                      </div>
                      <div className="space-y-1">
                        <div className="font-medium text-lg leading-7">
                          Drop files to build your post
                        </div>
                        <div className="max-w-md text-[#a1a1a1] text-sm leading-5">
                          Supports images and videos. Reorder items, choose a
                          thumbnail for videos, and track upload progress in
                          real time.
                        </div>
                      </div>
                      <div className="rounded-full bg-neutral-900 text-[#a1a1a1] text-sm leading-5 border-white/10 border-1 border-solid flex px-4 py-2 items-center gap-2">
                        <Upload className="size-4 text-neutral-200" />
                        <span>Select files</span>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-3 mt-5 gap-3">
                    <div className="group relative rounded-2xl bg-neutral-950/60 border-white/10 border-1 border-solid p-2 overflow-hidden">
                      <div className="flex absolute right-2 top-2 items-center gap-2">
                        <div className="shadow-sm rounded-full bg-neutral-950/80 text-[#a1a1a1] p-1.5">
                          <Move className="size-3.5" />
                        </div>
                        <div className="shadow-sm rounded-full bg-neutral-950/80 text-[#a1a1a1] p-1.5">
                          <X className="size-3.5" />
                        </div>
                      </div>
                      <div className="aspect-[4/3] rounded-xl bg-neutral-800 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3OTAzMTh8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGZpZWxkfGVufDF8fHx8MTc1NDkyMzc3N3ww&ixlib=rb-4.1.0&q=80&w=400"
                          alt="Football pitch preview"
                          className="object-cover w-full h-full"
                          data-photoid="p1"
                          data-authorname="Markus Spiske"
                          data-authorurl="https://unsplash.com/@markusspiske"
                          data-blurhash="L6H2?^?b00~q~qRjRjRj00RjRjRj"
                        />
                      </div>
                      <div className="text-[#a1a1a1] text-xs leading-4 flex mt-2 justify-between items-center">
                        <span>Image</span>
                        <span>Uploading 72%</span>
                      </div>
                      <div className="rounded-full bg-neutral-800 mt-2 h-1.5 overflow-hidden">
                        <div className="w-[72%] rounded-full bg-neutral-200 h-full" />
                      </div>
                    </div>
                    <div className="group relative rounded-2xl bg-neutral-950/60 border-white/10 border-1 border-solid p-2 overflow-hidden">
                      <div className="flex absolute right-2 top-2 items-center gap-2">
                        <div className="shadow-sm rounded-full bg-neutral-950/80 text-[#a1a1a1] p-1.5">
                          <Move className="size-3.5" />
                        </div>
                        <div className="shadow-sm rounded-full bg-neutral-950/80 text-[#a1a1a1] p-1.5">
                          <X className="size-3.5" />
                        </div>
                      </div>
                      <div className="aspect-[4/3] relative rounded-xl bg-neutral-800 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1517927033932-b3d18e61fb3a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3OTAzMTh8MHwxfHNlYXJjaHwxfHxzb2NjZXIlMjB2aWRlb3xlbnwxfHx8fDE3NTQ5MjM3Nzd8MA&ixlib=rb-4.1.0&q=80&w=400"
                          alt="Video preview"
                          className="object-cover w-full h-full"
                          data-photoid="p2"
                          data-authorname="Mick Haupt"
                          data-authorurl="https://unsplash.com/@rocinante_11"
                          data-blurhash="L9G8x^?b00~q~qRjRjRj00RjRjRj"
                        />
                        <div className="bg-black/20 flex absolute inset-0 justify-center items-center">
                          <div className="size-12 shadow-lg rounded-full bg-neutral-950/90 text-neutral-50 flex justify-center items-center">
                            <Play className="size-5 fill-current" />
                          </div>
                        </div>
                      </div>
                      <div className="text-[#a1a1a1] text-xs leading-4 flex mt-2 justify-between items-center">
                        <span>Video</span>
                        <button className="rounded-full bg-neutral-900 text-neutral-50 text-[11px] border-white/10 border-1 border-solid px-2 py-1">
                          Select thumbnail
                        </button>
                      </div>
                      <div className="rounded-full bg-neutral-800 mt-2 h-1.5 overflow-hidden">
                        <div className="w-[48%] rounded-full bg-neutral-200 h-full" />
                      </div>
                    </div>
                    <div className="group relative rounded-2xl bg-neutral-950/60 border-white/10 border-1 border-solid p-2 overflow-hidden">
                      <div className="flex absolute right-2 top-2 items-center gap-2">
                        <div className="shadow-sm rounded-full bg-neutral-950/80 text-[#a1a1a1] p-1.5">
                          <Move className="size-3.5" />
                        </div>
                        <div className="shadow-sm rounded-full bg-neutral-950/80 text-[#a1a1a1] p-1.5">
                          <X className="size-3.5" />
                        </div>
                      </div>
                      <div className="aspect-[4/3] relative rounded-xl bg-neutral-800 overflow-hidden">
                        <img
                          src="https://images.unsplash.com/photo-1508098682722-e99c43a406b2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3OTAzMTh8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGF0bGFzJTIwc3RhZGl1bXxlbnwxfHx8fDE3NTQ5MjM3Nzd8MA&ixlib=rb-4.1.0&q=80&w=400"
                          alt="Stadium preview"
                          className="object-cover w-full h-full"
                          data-photoid="p3"
                          data-authorname="Chris Chow"
                          data-authorurl="https://unsplash.com/@chrischow"
                          data-blurhash="L8H2?^?b00~q~qRjRjRj00RjRjRj"
                        />
                      </div>
                      <div className="text-[#a1a1a1] text-xs leading-4 flex mt-2 justify-between items-center">
                        <span>Image</span>
                        <span className="inline-flex items-center gap-1">
                          <LoaderCircle className="size-3 animate-spin text-neutral-200" />
                          Processing
                        </span>
                      </div>
                      <div className="rounded-full bg-neutral-800 mt-2 h-1.5 overflow-hidden">
                        <div className="w-[91%] rounded-full bg-neutral-200 h-full" />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-6">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <div className="font-medium text-base leading-6">
                        Caption
                      </div>
                      <div className="text-[#a1a1a1] text-sm leading-5">
                        Write a short update, match reaction, or turf review.
                      </div>
                    </div>
                    <div className="rounded-full bg-neutral-950 text-[#a1a1a1] text-xs leading-4 border-white/10 border-1 border-solid px-3 py-1">
                      248 / 500
                    </div>
                  </div>
                  <div className="ring-1 ring-transparent shadow-[inset_0_0_0_1px_rgba(255,255,255,0.02)] rounded-2xl bg-neutral-950/60 border-white/10 border-1 border-solid mt-4 p-4">
                    <div className="min-h-[160px] text-[#a1a1a1] text-sm leading-5">
                      What's happening in football?
                    </div>
                  </div>
                </div>
                <div className="shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-6">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <div className="font-medium text-base leading-6">
                        Section
                      </div>
                      <div className="text-[#a1a1a1] text-sm leading-5">
                        Choose a football context for your post.
                      </div>
                    </div>
                    <div className="text-[#a1a1a1] text-xs leading-4">
                      Optional
                    </div>
                  </div>
                  <div className="flex mt-4 flex-wrap gap-3">
                    <div className="rounded-full bg-neutral-200/10 text-neutral-200 text-sm leading-5 border-neutral-200 border-1 border-solid px-4 py-2">
                      Match Reaction
                    </div>
                    <div className="rounded-full bg-neutral-950 text-[#a1a1a1] text-sm leading-5 border-white/10 border-1 border-solid px-4 py-2">
                      Turf Experience
                    </div>
                    <div className="rounded-full bg-neutral-950 text-[#a1a1a1] text-sm leading-5 border-white/10 border-1 border-solid px-4 py-2">
                      Football Discussion
                    </div>
                    <div className="rounded-full bg-neutral-950 text-[#a1a1a1] text-sm leading-5 border-white/10 border-1 border-solid px-4 py-2">
                      No Section
                    </div>
                    <div className="rounded-full bg-neutral-950 text-neutral-200 text-sm leading-5 border-neutral-200/40 border-1 border-dashed flex px-4 py-2 items-center gap-2">
                      <Plus className="size-4" />
                      Create New Section
                    </div>
                  </div>
                </div>
              </div>
              <div className="flex flex-col gap-6">
                <div className="shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-6">
                  <div className="flex justify-between items-center gap-4">
                    <div>
                      <div className="font-medium text-base leading-6">
                        Live Post Preview
                      </div>
                      <div className="text-[#a1a1a1] text-sm leading-5">
                        This is how your post will appear in the feed.
                      </div>
                    </div>
                    <div className="rounded-full bg-neutral-950 text-[#a1a1a1] text-xs leading-4 border-white/10 border-1 border-solid px-3 py-1">
                      Preview
                    </div>
                  </div>
                  <div className="rounded-3xl bg-neutral-950/60 border-white/10 border-1 border-solid mt-4 p-4">
                    <div className="flex items-start gap-3">
                      <div className="size-11 font-medium rounded-full bg-neutral-800 text-sm leading-5 flex justify-center items-center">
                        AM
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-2">
                          <div className="font-medium">Arjun Mehta</div>
                          <BadgeCheck className="size-4 text-neutral-200" />
                          <div className="rounded-full bg-neutral-200/10 text-neutral-200 text-[11px] border-neutral-200/30 border-1 border-solid px-2 py-0.5">
                            Match Reaction
                          </div>
                        </div>
                        <div className="text-[#a1a1a1] text-xs leading-4">
                          @arjun_striker • just now
                        </div>
                      </div>
                      <MoreHorizontal className="size-5 text-[#a1a1a1]" />
                    </div>
                    <div className="text-neutral-50 text-sm leading-6 mt-4">
                      That second half was absolute madness. What a comeback. 🔥
                    </div>
                    <div className="rounded-2xl bg-neutral-800 border-white/10 border-1 border-solid mt-4 overflow-hidden">
                      <img
                        src="https://images.unsplash.com/photo-1518091043644-c1d4457512c6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3OTAzMTh8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMGZpZWxkfGVufDF8fHx8MTc1NDkyMzc3N3ww&ixlib=rb-4.1.0&q=80&w=800"
                        alt="Preview media"
                        className="object-cover w-full h-full"
                        data-photoid="p4"
                        data-authorname="Markus Spiske"
                        data-authorurl="https://unsplash.com/@markusspiske"
                        data-blurhash="L6H2?^?b00~q~qRjRjRj00RjRjRj"
                      />
                    </div>
                    <div className="text-[#a1a1a1] text-sm leading-5 flex mt-4 items-center gap-5">
                      <div className="flex items-center gap-2">
                        <Heart className="size-4" />
                        42
                      </div>
                      <div className="flex items-center gap-2">
                        <MessageCircle className="size-4" />
                        12
                      </div>
                      <div className="flex items-center gap-2">
                        <Share2 className="size-4" />5
                      </div>
                    </div>
                  </div>
                </div>
                <div className="shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-6">
                  <div className="text-[#a1a1a1] text-sm leading-5 flex items-center gap-3">
                    <AlertCircle className="size-4 text-[#ff6467]" />
                    <span>At least one image or video is required.</span>
                  </div>
                  <div className="flex mt-4 items-center gap-3">
                    <button className="bg-transparent rounded-full text-neutral-50 text-sm leading-5 border-white/10 border-1 border-solid px-5 py-3">
                      Cancel
                    </button>
                    <button className="rounded-full bg-neutral-800 text-neutral-50 text-sm leading-5 border-white/10 border-1 border-solid px-5 py-3">
                      Save Draft
                    </button>
                    <button className="font-medium opacity-50 shadow-[0_0_24px_rgba(255,255,255,0.08)] rounded-full bg-neutral-200 text-neutral-900 text-sm leading-5 px-5 py-3">
                      Publish Post
                    </button>
                  </div>
                </div>
                <div className="shadow-[0_0_0_1px_rgba(255,255,255,0.02),0_24px_80px_rgba(0,0,0,0.35)] rounded-3xl bg-neutral-900 border-white/10 border-1 border-solid p-6">
                  <div className="text-center flex py-8 flex-col justify-center items-center gap-4">
                    <div className="size-16 rounded-full bg-neutral-950 border-white/10 border-1 border-solid flex justify-center items-center">
                      <CircleDot className="size-7 text-neutral-200" />
                    </div>
                    <div className="space-y-1">
                      <div className="font-medium text-lg leading-7">
                        Post published successfully.
                      </div>
                      <div className="text-[#a1a1a1] text-sm leading-5">
                        Your update is now live across FootballHub.
                      </div>
                    </div>
                    <div className="max-w-sm rounded-full bg-neutral-800 p-1 w-full">
                      <div className="rounded-full bg-neutral-200 w-full h-2" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
