
import React, { useCallback, useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useNavigate } from "react-router-dom";
import Http from "@/Http";

const BaseURL = import.meta.env.VITE_API_HOST;
interface PriorityPeopleWidgetProps {}

const PriorityPeopleWidget = React.memo(({}: PriorityPeopleWidgetProps) => {
  // Sample data with actual profile image URLs
const navigate = useNavigate();
const [priorityPeople, setPriorityPeople] = useState([])
  
const getContact = useCallback(async (): Promise<void> => {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/");
      return;
    }
    Http.setBearerToken(token);
    const response = await Http.callApi(
      "get",
      `${BaseURL}/api/priority-people`
    );
    if (response) {
      setPriorityPeople(response?.data?.data?.contacts.slice(0, 5));
    } else {
      console.error("Failed to fetch user data");
    }
  } catch (error) {
    console.error("Error fetching user data:", error);
  }
}, []);

useEffect(() => {
  getContact();
}, [getContact]);


  return (
    <TooltipProvider>
      <div className="flex gap-1.5">
        {priorityPeople.map((person) => (
          <Popover key={person?.name}>
            <PopoverTrigger asChild>
              <div className="relative cursor-pointer">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Avatar className="h-8 w-8 ring-2 ring-background hover:scale-105 transition-transform">
                      <AvatarImage src={person?.avatar ? person?.avatar : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&rounded=true&name=${person?.name}`} alt={person?.name} />
                      <AvatarFallback className={`${
                        person?.active ? "bg-accent-primary/20 text-accent-primary" : "bg-surface-raised/30 text-text-secondary"
                      } text-xs`}>
                        {person?.name?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{person?.name}</p>
                  </TooltipContent>
                </Tooltip>
                {person.active && (
                  <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 border-2 border-background"></span>
                )}
              </div>
            </PopoverTrigger>
            <PopoverContent className="w-64 p-4">
              <div className="flex items-start gap-3">
                <Avatar className="h-10 w-10">
                    <AvatarImage src={person?.avatar ? person?.avatar : `https://ui-avatars.com/api/?background=0D8ABC&color=fff&rounded=true&name=${person?.name}`} alt={person?.name} />
                    <AvatarFallback>{person?.name?.charAt(0)}</AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="font-medium text-text-primary">{person?.name}</h3>
                  <p className="text-text-secondary text-sm">{person?.title || 'Product Manager' }</p>
                  <div className="flex items-center gap-1 mt-1 text-xs text-text-secondary">
                    <span>{person?.platform || 'Email'}</span>
                    <span>•</span>
                    <span>{person?.lastActivity}</span>
                  </div>
                </div>
              </div>
            </PopoverContent>
          </Popover>
        ))}
      </div>
    </TooltipProvider>
  );
});

PriorityPeopleWidget.displayName = 'PriorityPeopleWidget';
export default PriorityPeopleWidget;
