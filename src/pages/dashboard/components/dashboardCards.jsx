import React from "react";


export function TopCard({ title, value, icon, info, subInfo }) {
  return (
    <div className="p-[1px] rounded-[8px] bg-[linear-gradient(270deg,#ffbb34_0%,#202f49] flex-1 min-w-[150px] h-[131px]">
      <div className="bg-gray-900 rounded-[8px] h-full w-full p-4 shadow-md text-white flex flex-col justify-between">
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm text-gray-200">{title}</span>
          {icon && <span>{icon}</span>}
        </div>
        <div className="text-2xl font-bold">{value}</div>
        {info && <div className="text-xs text-green-400 mt-1">{info}</div>}
        {subInfo && <div className="text-xs text-gray-400 mt-1">{subInfo}</div>}
      </div>
    </div>
  );
}

export function InsightCard({ title, value , info, subInfo }) {
  return (
    <div className="bg-gray-900 rounded-[8px] p-4 shadow-md w-full min-w-[220px] h-auto text-white">
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-200">{title}</span>
      </div>
      <div className="text-2xl font-bold">{value}</div>
      {info && <div className="text-xs text-green-400 mt-1">{info}</div>}
      {subInfo && <div className="text-xs text-gray-400 mt-1">{subInfo}</div>}
    </div>
  );
}

export function UpcomingMatchesCard({ match, time }) {
  return (
    <div className="flex flex-row border-[0.6px] border-[#FFFFFF1F] justify-between rounded-[12px] p-[16px] w-full min-w-[220px] h-auto text-white">
      <div className="text-[14px]">{match}</div>
      {time && <div className="text-xs text-gray-400 mt-1">{time}</div>}
    </div>
  );
}
import { AlertTriangle, ArrowUpRight } from "lucide-react";

export function AlertCard({ teamLogo, message, type, time, actions }) {
  return (
    <div className="bg-gray-900 border border-[#232323] rounded-[12px] p-4 mb-3 flex flex-col gap-2 relative">
      <div className="flex items-center gap-3">
        <img src={`/assets/${teamLogo}`} alt="team logo" className="w-8 h-8 rounded-full" />
        <span className="text-sm text-white flex-1">{message}</span>
        {type === "danger" && (
          <AlertTriangle className="text-red-500 w-5 h-5" />
        )}
        {type === "success" && (
          <ArrowUpRight className="text-green-500 w-5 h-5" />
        )}
      </div>
      <div className="flex gap-2 mt-2">
        {actions.map((action) => (
          <button
            key={action}
            className={`px-4 py-1 rounded border text-xs font-semibold ${
              action === "Review" || action === "View"
                ? "border-[#FFBB34] text-[#FFBB34]"
                : "border-[#232323] bg-[#232323] text-white"
            }`}
          >
            {action}
          </button>
        ))}
      </div>
      <div className="text-xs text-gray-400 mt-1">{time}</div>
    </div>
  );
}