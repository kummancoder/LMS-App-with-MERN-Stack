import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
const Course = () => {
  return (
    <div>
      <Card className="overflow-hidden rounded-lg dark:bg-gray-800 bg-white shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300">
        <div className="relative">
          <img
            src="https://imgs.search.brave.com/PgPVNgFVJvpINLXVDsu-Y9YIFQY9lGKjja4jr87xfAo/rs:fit:860:0:0:0/g:ce/aHR0cHM6Ly9tZWRp/YS5nZWVrc2Zvcmdl/ZWtzLm9yZy93cC1j/b250ZW50L3VwbG9h/ZHMvMjAyMjExMjQx/MzEzMTIvQmVzdEZ1/bGxTdGFja0RldmVs/b3BlckNvdXJzZXMy/MDIzLnBuZw"
            alt="Course"
            className="w-full h-36 object-cover rounded-t-lg"
          />
          <CardContent className="px-5 py-4 space-y-3">
            <h1 className="hover:underline font-bold text-lg truncate">
              Full stack complete Course With AI
            </h1>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-3">
                <Avatar className="w-8 h-8">
                  <AvatarImage
                    src="https://github.com/shadcn.png"
                    alt="@shadcn"
                  />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <h1 className="font-medium text-sm">Kumman Coder</h1>
              </div>
              <Badge
                className={
                  "bg-blue-600 text-white px-2 py-1 rounded-full text-xs"
                }
              >
                Advance
              </Badge>
            </div>
            <div className="text-lg font-bold">
                <span >₹499</span>
            </div>
          </CardContent>
        </div>
      </Card>
    </div>
  );
};

export default Course;
