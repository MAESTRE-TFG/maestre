"use client";

import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { SidebarDemo } from "@/components/sidebar-demo";
import { useTheme } from "@/components/theme-provider";
import { cn } from "@/lib/utils";
import axios from 'axios';
import { ProfileEditForm } from "@/components/profile_edit-form";
import { Label } from "@/components/ui/label";

export default function ProfileEdit() {
  const router = useRouter();
  const { theme } = useTheme();
  const [user, setUser] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    name: "",
    surname: "",
  });
  const [error, setError] = useState(null);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      setUser(user);
      setFormData({
        username: user.username,
        email: user.email,
        name: user.name,
        surname: user.surname,
      });
    } else {
      router.push("/signin");
    }
  }, [router]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleUpdate = async () => {
    try {
      const response = await axios.put('http://localhost:8000/api/users/update/', formData, {
        headers: {
          'Authorization': `Token ${localStorage.getItem('authToken')}`
        }
      });
      localStorage.setItem('user', JSON.stringify(response.data));
      setUser(response.data);
      setEditMode(false);
    } catch (err) {
      setError("Update failed");
    }
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete your account? This action cannot be undone.")) {
      try {
        await axios.delete('http://localhost:8000/api/users/delete/', {
          headers: {
            'Authorization': `Token ${localStorage.getItem('authToken')}`
          }
        });
        localStorage.removeItem('authToken');
        localStorage.removeItem('user');
        router.push("/signin");
      } catch (err) {
        setError("Delete failed");
      }
    }
  };

return (
    <SidebarDemo ContentComponent={() => (
        <div className="min-h-screen flex flex-col justify-center items-center py-12 sm:px-6 lg:px-8">
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                <h1
                    className={cn(
                      "mt-6 text-center text-3xl font-extrabold text-zinc-100",
                      theme === "dark" ? "text-white" : "text-dark"
                    )}
                >
                    Hello {" "}
                    <span style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
                        {user.name}
                    </span>
                </h1>
                <h3
                    className={cn(
                      "mt-6 text-center text-3xl font-extrabold text-zinc-100",
                      theme === "dark" ? "text-white" : "text-dark"
                    )}
                >
                    See and edit your profile and data.
                </h3>
                <style jsx global>{`
                  @import url("https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap");
                `}</style>
            </div>
            <div className="sm:mx-auto sm:w-full sm:max-w-md">
                {error && <p className="text-red-500">{error}</p>}
                {editMode ? (
                    <ProfileEditForm
                        formData={formData}
                        handleChange={handleChange}
                        handleUpdate={handleUpdate}
                        handleCancel={() => setEditMode(false)}
                    />
                ) : (
                    <div className={cn("max-w-lg w-full mx-auto rounded-none md:rounded-2xl p-4 md:p-8 shadow-input", theme === "dark" ? "bg-black" : "bg-white")}>
                        <style jsx global>{
                            `@import url('https://fonts.googleapis.com/css2?family=Alfa+Slab+One&display=swap');`
                        }</style>
                        <div className="my-8" style={{ fontFamily: "'Alfa Slab One', sans-serif" }}>
                            <LabelInputContainer className="mb-4">
                                <Label>Username</Label>
                                <p className="input">{user?.username}</p>
                            </LabelInputContainer>
                            <LabelInputContainer className="mb-4">
                                <Label>Email Address</Label>
                                <p className="input">{user?.email}</p>
                            </LabelInputContainer>
                            <LabelInputContainer className="mb-4">
                                <Label>Name</Label>
                                <p className="input">{user?.name}</p>
                            </LabelInputContainer>
                            <LabelInputContainer className="mb-4">
                                <Label>Surname</Label>
                                <p className="input">{user?.surname}</p>
                            </LabelInputContainer>
                            <button onClick={() => setEditMode(true)} className="btn">Edit</button>
                            <button onClick={handleDelete} className="btn">Delete Account</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )} />
);
}


const LabelInputContainer = ({
  children,
  className
}) => {
  return (
    <div className={cn("flex flex-col space-y-2 w-full", className)}>
      {children}
    </div>
  );
};
