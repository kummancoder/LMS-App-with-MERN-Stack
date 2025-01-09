import React, { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import Course from "./Course";
import {
  useLoadUserQuery,
  useUpdateUserProfileMutation,
} from "@/features/api/authApi";
import { toast } from "sonner";

const Profile = () => {
  const { data, isLoading, refetch } = useLoadUserQuery();

  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");

  const [
    updateUser,
    {
      data: updatedUserData,
      isLoading: updatedUserIsLoading,
      error: updateError,
      isSuccess,
    },
  ] = useUpdateUserProfileMutation();

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const user = data?.data;

  const updateUserHandler = async () => {
    const formData = new FormData();
    formData.append("name", name);
    if (profilePhoto) {
      formData.append("profilePhoto", profilePhoto);
    }
    await updateUser(formData);
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(updatedUserData?.message || "Profile Updated");
    }
    if (updateError) {
      toast.error(updateError?.message || "Failed to update Profile");
    }
  }, [updateError, updatedUserData, isSuccess]);

  useEffect(() => {
    refetch();
  }, [isSuccess]);

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto my-24 px-4">
        <div className="animate-pulse">
          {/* Header Skeleton */}
          <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mb-8"></div>

          <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
            {/* Avatar Skeleton */}
            <div className="h-24 w-24 md:h-32 md:w-32 bg-gray-300 dark:bg-gray-700 rounded-full"></div>

            {/* Info Skeleton */}
            <div className="space-y-4 w-full">
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-3/4"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-2/3"></div>
              <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/2"></div>
              <div className="h-8 bg-gray-300 dark:bg-gray-700 rounded w-1/4 mt-4"></div>
            </div>
          </div>
        </div>

        {/* Courses Section Skeleton */}
        <div className="animate-pulse mt-8">
          <div className="h-6 bg-gray-300 dark:bg-gray-700 rounded w-1/3 mb-6"></div>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {[...Array(6)].map((_, index) => (
              <div
                key={index}
                className="h-40 bg-gray-300 dark:bg-gray-700 rounded"
              ></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto my-24 px-4">
        <h1 className="font-bold text-2xl text-center md:text-left">
          No User Data
        </h1>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto my-24 px-4">
      <h1 className="font-bold text-2xl text-center md:text-left">Profile</h1>
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 my-5">
        <div className="flex flex-col items-center">
          <Avatar className="h-24 w-24 md:h-32 md:w-32 mb-4">
            <AvatarImage
              className="rounded-full"
              src={user.photoUrl || "https://github.com/shadcn.png"}
              alt="@shadcn"
            />
            <AvatarFallback>CN</AvatarFallback>
          </Avatar>
        </div>
        <div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Name:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user.name}
              </span>
            </h1>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Email:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user.email}
              </span>
            </h1>
          </div>
          <div>
            <h1 className="font-semibold text-gray-900 dark:text-gray-100">
              Role:
              <span className="font-normal text-gray-700 dark:text-gray-300 ml-2">
                {user.role.toUpperCase()}
              </span>
            </h1>
          </div>
          <Dialog>
            <DialogTrigger asChild>
              <Button size="sm" className="mt-2">
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
                <DialogDescription>
                  Make Changes to your profile here. Click save when you are
                  done.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Name</Label>
                  <Input
                    className="col-span-3"
                    placeholder="Name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label>Profile Photo</Label>
                  <Input
                    className="col-span-3"
                    type="file"
                    accept="image/*"
                    onChange={onChangeHandler}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={updatedUserIsLoading}
                  onClick={updateUserHandler}
                >
                  {updatedUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Please wait
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>
      <div>
        <h1 className="font-medium text-lg">Courses you are enrolled in</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 my-4">
          {user.enrolledCourses?.length === 0 ? (
            <h1>You have not enrolled in any course.</h1>
          ) : (
            user.enrolledCourses.map((course) => (
              <Course key={course._id} course={course} />
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;
