import React, { useEffect } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { create } from "zustand";

interface BearerState {
  bearerToken: string | null;
  setBearerToken: (token: string | null) => void;
}

const useBearerStore = create<BearerState>((set) => ({
  bearerToken: null,
  setBearerToken: (token) => set(() => ({ bearerToken: token })),
}));

type FormInput = {
  token: string;
};

export function TokenForm() {
  const { setBearerToken } = useBearerStore();
  const { register, handleSubmit } = useForm<FormInput>();
  const onSubmit: SubmitHandler<FormInput> = (data) => {
    console.log(data);
    if (data.token) {
      chrome.storage.local
        .set({ bearer: data.token })
        .then(() => {
          setBearerToken(data.token);
          // window.close();
        })
        .catch((err) => console.error(err));
    }
  };

  return (
    <div className="border-red-500">
      <form onSubmit={handleSubmit(onSubmit)} className="space-x-2" id="myForm">
        <input
          className="w-80 rounded-lg border border-slate-300 bg-inherit py-2 text-slate-800 shadow-sm placeholder:text-center placeholder:italic placeholder:text-slate-400 focus:border-sky-500 focus:outline-none focus:ring-1 focus:ring-sky-500 disabled:border-slate-200 disabled:bg-slate-50 disabled:text-slate-900 disabled:shadow-none dark:bg-white sm:text-sm"
          placeholder="bearer token"
          id="token"
          {...register("token")}
        />

        <CustomButton type="submit">submit</CustomButton>
        {/* <input
          className="ml-4 rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white shadow-sm  hover:bg-blue-300 focus:ring focus:ring-blue-300 active:bg-blue-700"
          type="submit"
        /> */}
      </form>
      <div className="flex items-baseline space-x-2">
        <IsConfigured />
        <CustomButton
          onClick={() => {
            chrome.storage.local
              .remove("bearer")
              .then(() => setBearerToken(""))
              .catch((err) => console.error(err));
          }}
        >
          Clear
        </CustomButton>
      </div>
    </div>
  );
}

function IsConfigured() {
  const { bearerToken, setBearerToken } = useBearerStore();
  useEffect(() => {
    chrome.storage.local
      .get(["bearer"])
      .then((result) => {
        const bearerToken = result.bearer;
        setBearerToken(bearerToken);
      })
      .catch((error) => {
        console.error("Error retrieving token:", error);
      });
  }, [setBearerToken]);

  return <p className="mt-3 text-3xl">{bearerToken ? "✅" : "❌"}</p>;
}

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  children?: React.ReactNode;
};

const CustomButton: React.FC<ButtonProps> = ({ children, ...props }) => (
  <button
    className=" inline-flex h-10 w-14 flex-shrink-0 items-center justify-center gap-2 rounded-lg border border-transparent bg-blue-100 px-4 py-3 text-sm font-semibold text-blue-500 ring-offset-white transition-all hover:bg-blue-500 hover:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
    {...props}
  >
    {children}
  </button>
  // <button
  //   className="rounded-md bg-blue-500 px-3 py-2 text-sm font-semibold text-white  hover:bg-blue-300 focus:ring focus:ring-blue-200 active:bg-blue-700"
  //   {...props}
  // >
  //   {children}
  // </button>
);
