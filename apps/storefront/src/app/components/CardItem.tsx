"use client";

import React, { useCallback } from "react";
import { Github, FileText } from "lucide-react";

interface CardProps {
  card: {
    title: string;
    description: string;
    link: string;
    linkText: string;
    githubUrl?: string;
    docsUrl?: string;
    disabled?: boolean;
  };
}

const CardItem: React.FC<CardProps> = ({ card }) => {
  const handleClick = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    if (card.disabled) {
      return;
    }
    if (card.link) {
      window.location.href = card.link;
    }
  }, [card.link, card.disabled]);

  return (
    <div className="bg-slate-100 dark:bg-[#1E2735] rounded-[20px] relative p-6 pt-12 lg:p-12 md:ml-6 h-full">
      <h4 className="text-2xl font-bold mb-4">{card.title}</h4>
      <p className="opacity-70 mb-4">{card.description}</p>
      <div className="flex items-center justify-between mb-4">
        <button
          onClick={handleClick}
          disabled={card.disabled}
          className={`font-bold py-2 px-4 rounded inline-block ${
            card.disabled
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-blue-500 hover:bg-blue-600 text-white'
          }`}
        >
          {card.linkText}
        </button>
        <div className="flex space-x-2">
          {card.githubUrl && (
            <a href={card.githubUrl} target="_blank" rel="noopener noreferrer">
              <Github size={24} />
            </a>
          )}
          {card.docsUrl && (
            <a href={card.docsUrl} target="_blank" rel="noopener noreferrer">
              <FileText size={24} />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

export default CardItem;