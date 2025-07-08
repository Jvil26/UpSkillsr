"use client";
import React from "react";
import { useDroppable } from "@dnd-kit/core";

export function Droppable(props: { id: string; children: React.ReactNode; className: string }) {
  const { isOver, setNodeRef } = useDroppable({
    id: props.id,
  });
  const style: React.CSSProperties = {
    transform: isOver ? "scale(1.02)" : "scale(1)",
    height: "fit-content",
    paddingBottom: isOver ? "200px" : "",
  };

  return (
    <div ref={setNodeRef} style={style} className={props.className}>
      {props.children}
    </div>
  );
}
