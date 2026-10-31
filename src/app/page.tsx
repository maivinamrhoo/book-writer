"use client";

import { useEditorStore } from "@/lib/store";
import WelcomeScreen from "@/components/WelcomeScreen";
import CreateBookFlow from "@/components/CreateBookFlow";
import BookEditor from "@/components/editor/BookEditor";
import BookSettings from "@/components/BookSettings";
import ExportBook from "@/components/ExportBook";
import FrontMatter from "@/components/FrontMatter";
import { AnimatePresence, motion } from "framer-motion";

export default function Home() {
  const { currentView } = useEditorStore();

  const renderView = () => {
    switch (currentView) {
      case "welcome":
        return <WelcomeScreen />;
      case "create":
        return <CreateBookFlow />;
      case "editor":
        return <BookEditor />;
      case "settings":
        return <BookSettings />;
      case "export":
        return <ExportBook />;
      case "frontmatter":
        return <FrontMatter />;
      default:
        return <WelcomeScreen />;
    }
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={currentView}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {renderView()}
      </motion.div>
    </AnimatePresence>
  );
}
