// "use client";

// import { useTransition } from "react";
// import { useRouter } from "next/navigation";
// import { disableDraftMode } from "@/app/actions";
// import { useDraftModeEnvironment } from "next-sanity/hooks";

// export function DisableDraftMode() {
//   const router = useRouter();
//   const environment = useDraftModeEnvironment();
//   const [pending, startTransition] = useTransition();

//   //Only show the disable draft mode button when outside of Presentation Tool
//   if (environment !== "live" && environment !== "unknown") {
//     return null;
//   }

//   // if (window !== window.parent || !!window.opener) {
//   //   return null;
//   // }

//   const handleClick = async () => {
//     await fetch("/draft-mode/disable");
//     router.refresh();
//   };
//   // startTransition(async () => {
//   //   await disableDraftMode();
//   //   router.refresh();
//   // });

//   return (
//     <button
//       onClick={handleClick}
//       className="fixed bottom-4 right-4 bg-white text-black px-4 py-2 rounded shadow z-50"
//     >
//       Disable draft mode
//     </button>
//   );
// }



// "use client";

// import { useTransition } from "react";
// import { useRouter } from "next/navigation";
// import { disableDraftMode } from "@/app/actions";

// export function DisableDraftMode() {
//   const router = useRouter();
//   const [pending, startTransition] = useTransition();
  
//   if (window !== window.parent || !!window.opener) {
//     return null;
//   }

//   const disable = () =>
//     startTransition(async () => {
//       await disableDraftMode();
//       router.refresh();
//     });

//   return (
//     <div>
//       {pending ? (
//         "Disabling draft mode..."
//       ) : (
//         <button type="button" onClick={disable}>
//           Disable draft mode
//         </button>
//       )}
//     </div>
//   );
// }