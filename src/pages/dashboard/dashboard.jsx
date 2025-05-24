import MainLayout from "../../layouts/mainLayout";
import { TopCard, UpcomingMatchesCard, InsightCard, AlertCard } from "./components/dashboardCards";
import data from "../../data.json"; 
import { Users, User, Cpu, Heart } from "lucide-react";


const iconMap = {
  users: <Users className="w-7 h-7 text-gray-400" />,
  user: <User className="w-7 h-7 text-gray-400" />,
  cpu: <Cpu className="w-7 h-7 text-gray-400" />,
  heart: <Heart className="w-7 h-7 text-gray-400" />,
};

export default function Dashboard() {
  return (
    <MainLayout>
      <div className="flex flex-col gap-4 mt-[120px] px-4">
        <div className="flex gap-6 w-full">
          {data.introInsights.map((item, idx) => (
            <TopCard
              key={idx}
              title={item.title}
              value={item.value}
              icon={iconMap[item.icon]}
              info={item.info}
              subInfo={item.subInfo}
            />
          ))}
        </div>
        <div className="flex gap-4 w-full">
            <div className="bg-transparent flex flex-col gap-4 rounded-[12px] p-0 mt-4 w-3/5 min-w-[220px] h-auto text-white">
                <div className="flex flex-row justify-between items-center mb-2 gap-4">
                    <div className="flex flex-col bg-[#0F111F] rounded-[8px] gap-4 p-4 w-1/2 min-w-[220px] h-auto text-white">
                        <span className="text-sm text-gray-200">Upcoming Matches</span>
                        {data.upcomingMatches.map((match, idx) => (
                            <UpcomingMatchesCard
                                key={idx}
                                match={match.match}
                                time={match.time}
                            />
                        ))}
                    </div>
                    <div className="flex flex-col bg-[#0F111F] rounded-[8px] gap-4 p-4 w-1/2 min-w-[220px] h-auto text-white">
                        <span className="text-sm text-gray-200">AI Insights</span>
                        {data.upcomingMatches.map((match, idx) => (
                            <UpcomingMatchesCard
                                key={idx}
                                match={match.match}
                                time={match.time}
                            />
                        ))}
                    </div>
                </div>
                <div className="flex justify-between items-center mb-2">
                  hello
                </div>
            </div>
            <div className="bg-[#0F111F] rounded-[8px] p-4 shadow-md w-2/5 min-w-[220px] h-auto text-white">
              <div className="flex justify-between items-center mb-4">
                <span className="text-white font-semibold">Quick alerts</span>
                <button className="text-xs text-[#FFBB34]">Mark all as read</button>
              </div>
              {data.quickAlerts.map((alert, idx) => (
                <AlertCard key={idx} {...alert} />
              ))}
            </div>
        </div>
      </div>
    </MainLayout>
  );
}
