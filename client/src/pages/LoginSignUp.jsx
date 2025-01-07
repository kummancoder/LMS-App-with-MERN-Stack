import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  useLoginUserMutation,
  useRegisterUserMutation,
} from "@/features/api/authApi";
import { FolderGit } from "lucide-react";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";

const LoginSignUp = () => {
  const [signupInput, setSignupInput] = useState({
    fullName: "",
    email: "",
    password: "",
  });

  const [loginInput, setLoginInput] = useState({
    email: "",
    password: "",
  });

  const [
    registerUser,
    {
      data: registerData,
      error: registerError,
      isLoading: registerIsLoading,
      isSuccess: registerIsSuccess,
    },
  ] = useRegisterUserMutation();
  const [
    loginUser,
    {
      data: loginData,
      error: loginError,
      isLoading: loginIsLoading,
      isSuccess: loginIsSuccess,
    },
  ] = useLoginUserMutation();
  const changeInputHandler = (e, type) => {
    const { name, value } = e.target;
    if (type == "signup") {
      setSignupInput({
        ...signupInput,
        [name]: value,
      });
    } else {
      setLoginInput({
        ...loginInput,
        [name]: value,
      });
    }
  };

  const handleRegistration = (type) => {
    // console.log(type === "login" ? loginInput : signupInput);
    const inputData = type === "login" ? loginInput : signupInput;
    const action = type === "login" ? loginUser : registerUser;
    action(inputData);
  };

  useEffect(() => {
    console.log("Register Error:", registerError);
    console.log("Register Is Success:", registerIsSuccess);
    console.log("Register Data:", registerData);
    if (registerIsSuccess && registerData) {
      toast.success(registerData.message || "Signup successful.");
    }
    if (registerError) {
      toast.error(registerError.data.message || "Signup Failed");
    }
    if (loginIsSuccess && loginData) {
      toast.success(loginData.message || "Login successful.");
      navigate("/");
    }
    if (loginError) {
      toast.error(loginError.data.message || "login Failed");
    }
  }, [
    loginIsSuccess,
    registerIsSuccess,
    loginIsLoading,
    registerIsLoading,
    loginData,
    registerData,
    loginError,
    registerError,
  ]);
  return (
    <div className="flex justify-center items-center h-screen">
      <Tabs defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signup">Signup</TabsTrigger>
          <TabsTrigger value="login">Login</TabsTrigger>
        </TabsList>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Signup</CardTitle>
              <CardDescription>
                Create a new account and click signup when you're done.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="fullName">Name</Label>
                <Input
                  type="text"
                  name="fullName"
                  id="fullName"
                  required={true}
                  placeholder="Eg. Kumman Dhakad"
                  value={signupInput.fullName}
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  required={true}
                  placeholder="Eg. kumman@gmail.com"
                  value={signupInput.email}
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  required={true}
                  value={signupInput.password}
                  placeholder="xyz"
                  onChange={(e) => changeInputHandler(e, "signup")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                onClick={() => handleRegistration("signup")}
                disabled={registerIsLoading}
                aria-label={registerIsLoading ? "Signing up..." : "Signup"}
              >
                {registerIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please Wait
                  </>
                ) : (
                  "Signup"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Login your password here. After signup, you'll be logged in.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="email">Email</Label>
                <Input
                  type="email"
                  name="email"
                  id="email"
                  required={true}
                  placeholder="Eg. kumman@gmail.com"
                  value={loginInput.email}
                  onChange={(e) => changeInputHandler(e, "login")}
                />
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
                <Input
                  type="password"
                  name="password"
                  id="password"
                  required={true}
                  placeholder="xyz"
                  value={loginInput.password}
                  onChange={(e) => changeInputHandler(e, "login")}
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button
                disabled={loginIsLoading}
                onClick={() => {
                  handleRegistration("login");
                }}
                aria-label={loginIsLoading ? "Logging in..." : "Login"}
              >
                {loginIsLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please Wait
                  </>
                ) : (
                  "Login"
                )}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LoginSignUp;
