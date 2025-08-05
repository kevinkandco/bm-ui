import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Shield,
  Plus,
  X,
  AlertTriangle,
  User,
  Hash,
  Bell,
  Save,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { SettingsTabProps } from "./types";
import FancyLoader from "./FancyLoader";
import suggestedTopicsData from "@/data/suggestedTopics.json";
import { Contact } from "@/components/onboarding/priority-people/types";
import { useApi } from "@/hooks/useApi";
import { Provider } from "../types";

const InterruptRules = ({
  providerData,
  setProviderData,
  SyncLoading,
  syncData,
  loadingProviderData,
  provider,
  shouldRefreshContacts,
  setShouldRefreshContacts
}: SettingsTabProps) => {
  const { call } = useApi();
  const [newContact, setNewContact] = useState("");
  const [newKeyword, setNewKeyword] = useState("");
  const [newKeywordIsInputFocused, setIsNewKeywordInputFocused] = useState(false);
  const [newContactIsInputFocused, setIsNewContactInputFocused] = useState(false);
  const [keywordSearchResults, setKeywordSearchResults] = useState<
    string[]
  >([]);
  const [contactSearchResults, setContactSearchResults] = useState<
    Contact[]
  >([]);
  const [suggestedTopics] = useState(
    suggestedTopicsData.map((topic) => topic.name)
  );
  const [suggestedContacts, setSuggestedContacts] = useState<Contact[]>([]);
  const contactInputRef = useRef<HTMLInputElement>(null);
  const keywordInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setProviderData((prev) => ({
      ...prev,
      interruptRules: {
        contacts: prev?.interruptRules?.contacts ?? [],
        keywords: prev?.interruptRules?.keywords ?? [],
        systemAlerts: prev?.interruptRules?.systemAlerts ?? [],
      },
    }));
  }, [setProviderData]);

    const getContact = useCallback(async (): Promise<void> => {
  
      const cacheKey = `/${Provider[provider?.name]}/contacts/${provider?.id}`;
      const CACHE_EXPIRY_HOURS = 24;
  
      const cache = await caches.open("contacts-cache");
      const cachedResponse = await cache.match(cacheKey);
  
      if (cachedResponse) {
        const cachedJson = await cachedResponse.json();
  
        const now = Date.now();
        const cachedTime = cachedJson?.cachedAt ?? 0;
        const isExpired = now - cachedTime > CACHE_EXPIRY_HOURS * 60 * 60 * 1000;
  
        if (!isExpired) {
          setSuggestedContacts(cachedJson.contacts);
          return;
        } else {
          // Optionally delete expired cache
          await cache.delete(cacheKey);
        }
      }
  
      // If not cached or expired, fetch fresh
      const response = await call("get", cacheKey);
  
      if (response) {
        const now = Date.now();
        setSuggestedContacts(response?.contacts);
        const wrappedResponse = {
          cachedAt: now,
          contacts: response?.contacts,
        };
  
        const cacheResponse = new Response(JSON.stringify(wrappedResponse), {
          headers: { "Content-Type": "application/json" },
        });
        await cache.put(cacheKey, cacheResponse);
      }
    }, [call, provider]);
  
  
    useEffect(() => {
      getContact();
    }, [getContact]);
  
    useEffect(() => {
      if (shouldRefreshContacts) {
        getContact().then(() => {
          setShouldRefreshContacts?.(false);
        });
      }
    }, [shouldRefreshContacts, getContact, setShouldRefreshContacts]);

  const systemAlertOptions = [
    "PagerDuty",
    "Datadog",
    "Sentry",
    "AWS CloudWatch",
    "New Relic",
    "Splunk",
    "Nagios",
    "Grafana",
  ];

  const addContact = () => {
    if (!newContact.trim()) return;
    setProviderData((prev) => {
      const existingContacts = prev?.interruptRules?.contacts ?? [];

      return {
        ...prev,
        interruptRules: {
          ...prev.interruptRules,
          contacts: [
            ...existingContacts,
            { name: newContact.trim(), email: "" },
          ],
        },
      };
    });
    setNewContact("");
  };

  const removeContact = (index: number) => {
    setProviderData((prev) => {
      const existingContacts = prev?.interruptRules?.contacts ?? [];
      const updatedContacts = existingContacts.filter((_, i) => i !== index);

      return {
        ...prev,
        interruptRules: {
          ...prev.interruptRules,
          contacts: updatedContacts,
        },
      };
    });
  };

  const addKeyword = () => {
    if (!newKeyword.trim()) return;

    setProviderData((prev) => {
      const existingKeywords = prev?.interruptRules?.keywords ?? [];

      return {
        ...prev,
        interruptRules: {
          ...prev.interruptRules,
          keywords: [...existingKeywords, newKeyword.trim()],
        },
      };
    });

    setNewKeyword("");
  };

  const removeKeyword = (index: number) => {
    setProviderData((prev) => {
      const existingKeywords = prev?.interruptRules?.keywords ?? [];
      const updatedKeywords = existingKeywords.filter((_, i) => i !== index);

      return {
        ...prev,
        interruptRules: {
          ...prev.interruptRules,
          keywords: updatedKeywords,
        },
      };
    });
  };

  const toggleSystemAlert = (alert: string) => {
    setProviderData((prev) => {
      const existingAlerts = prev?.interruptRules?.systemAlerts ?? [];
      const updatedAlerts = existingAlerts.includes(alert)
        ? existingAlerts.filter((a) => a !== alert)
        : [...existingAlerts, alert];

      return {
        ...prev,
        interruptRules: {
          ...prev.interruptRules,
          systemAlerts: updatedAlerts,
        },
      };
    });
  };

  const selectKeyword = (topic: string) => {
    if (!topic.trim()) return;

    setProviderData((prev) => {
      const existingKeywords = prev?.interruptRules?.keywords ?? [];

      return {
        ...prev,
        interruptRules: {
          ...prev.interruptRules,
          keywords: [...existingKeywords, topic.trim()],
        },
      };
    });

    setNewKeyword("");
    setKeywordSearchResults([]);
    setIsNewKeywordInputFocused(false);
  };

  const selectContact = (contact: Contact) => {
    if (!contact) return;

    setProviderData((prev) => {
      const existingContacts = prev?.interruptRules?.contacts ?? [];

      return {
        ...prev,
        interruptRules: {
          ...prev.interruptRules,
          contacts: [...existingContacts, contact],
        },
      };
    });

    setNewKeyword("");
    setKeywordSearchResults([]);
    setIsNewKeywordInputFocused(false);
  };

  useEffect(() => {
    if (newKeywordIsInputFocused) {
      const filtered = suggestedTopics
      ?.filter((topic) =>
        topic?.toLowerCase()?.includes(newKeyword.toLowerCase())
      )
      ?.filter(
        (topic) =>
          !providerData?.interruptRules?.keywords?.some(
            (ignore: string) => ignore.toLowerCase() === topic.toLowerCase()
          )
      );
    setKeywordSearchResults(filtered);
    } else if (newContactIsInputFocused) {
      const filtered = suggestedContacts
      ?.filter((contact) =>
        contact?.email?.toLowerCase()?.includes(newContact.toLowerCase()) ||
        contact?.name?.toLowerCase()?.includes(newContact.toLowerCase())
      )
      ?.filter(
        (topic) =>
          !providerData?.interruptRules?.contacts?.some(
            (ignore) => ignore?.email?.toLowerCase() === topic?.email?.toLowerCase()
          )
      );
      setContactSearchResults(filtered);
    } else {
      setKeywordSearchResults([]);
    }
  }, [newKeyword, newKeywordIsInputFocused, providerData, suggestedTopics, newContactIsInputFocused, suggestedContacts, newContact]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        contactInputRef.current &&
        !contactInputRef.current.contains(event.target as Node)
      ) {
        setTimeout(() => setIsNewContactInputFocused(false), 200);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        keywordInputRef.current &&
        !keywordInputRef.current.contains(event.target as Node)
      ) {
        setTimeout(() => setIsNewKeywordInputFocused(false), 200);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-text-primary">
          Interrupt Rules
        </h2>
        {syncData && (
          <Button
            variant="outline"
            size="none"
            onClick={syncData}
            disabled={SyncLoading}
            className="text-white/80 border-white/20 hover:bg-white/10 hover:text-white px-2 py-1"
          >
            {SyncLoading && (
              <svg
                aria-hidden="true"
                className="w-8 h-8 text-white animate-spin dark:text-white fill-blue-600"
                viewBox="0 0 100 101"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                  fill="currentColor"
                />
                <path
                  d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                  fill="currentFill"
                />
              </svg>
            )}
            {SyncLoading ? "Syncing" : "Sync"}
          </Button>
        )}
      </div>

      <div className="bg-amber-500/10 border border-amber-500/20 rounded-lg p-4">
        <div className="flex items-start space-x-3">
          <AlertTriangle className="h-5 w-5 text-amber-400 mt-0.5" />
          <div>
            <h3 className="font-medium text-text-primary">
              Emergency Override System
            </h3>
            <p className="text-sm text-text-secondary mt-1">
              These rules can pierce through Focus Mode and device Do Not
              Disturb settings. Use sparingly for genuine emergencies only to
              maintain effectiveness.
            </p>
          </div>
        </div>
      </div>

      {loadingProviderData ? (
        <FancyLoader />
      ) : (
        <>
          <div className="glass-card rounded-2xl p-6 space-y-8">
            {/* Emergency Contacts */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <User className="h-5 w-5 text-text-secondary" />
                <h3 className="text-lg font-medium text-text-primary">
                  Emergency Contacts
                </h3>
              </div>
              <p className="text-sm text-text-secondary">
                People who can interrupt you for urgent matters. Messages from
                these contacts will trigger OS notifications even during Focus
                Mode.
              </p>

              <div className="flex space-x-2">
                <div className="relative flex-grow">
                  <Input
                    ref={contactInputRef}
                    placeholder="Enter contact name"
                    value={newContact}
                    onChange={(e) => setNewContact(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addContact()}
                    className="flex-1 bg-white/5 border-white/20"
                    onFocus={() => setIsNewContactInputFocused(true)}
                  />
                  {newContactIsInputFocused &&
                    contactSearchResults &&
                    contactSearchResults?.length > 0
                     && (
                      <div className="absolute z-10 mt-1 w-full bg-deep-plum/95 border border-white/20 rounded-md shadow-lg divide-y divide-white/10 max-h-60 overflow-y-auto">
                        {contactSearchResults?.map((contact) => (
                          <div
                            key={contact.id}
                            onClick={() => selectContact(contact)}
                            className="px-3 py-3 flex items-center gap-2 hover:bg-white/10 cursor-pointer"
                          >
                            <span className="text-off-white">{contact.name} <span className="text-sm text-text-secondary">({contact.email})</span></span>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
                <Button
                  onClick={addContact}
                  disabled={!newContact.trim()}
                  size="sm"
                  variant="outline"
                  className="bg-white/5 border-white/20"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {providerData?.interruptRules?.contacts.length > 0 && (
                <div className="space-y-2">
                  {providerData?.interruptRules?.contacts?.map(
                    (contact, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-3 bg-white/5 rounded-lg border border-white/10"
                      >
                        <div>
                          <span className="text-text-primary font-medium">
                            {contact.name}
                          </span>
                          {contact.email && (
                            <span className="text-text-secondary text-sm ml-2">
                              ({contact.email})
                            </span>
                          )}
                        </div>
                        <Button
                          onClick={() => removeContact(index)}
                          variant="ghost"
                          size="sm"
                          className="text-text-secondary hover:text-red-400"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>

            <Separator className="bg-white/10" />

            {/* Emergency Keywords */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Hash className="h-5 w-5 text-text-secondary" />
                <h3 className="text-lg font-medium text-text-primary">
                  Emergency Keywords
                </h3>
              </div>
              <p className="text-sm text-text-secondary">
                Messages containing these words will trigger interrupt
                notifications. Choose words that clearly indicate urgent
                situations.
              </p>

              <div className="flex space-x-2">
                <div className="relative flex-grow">
                  <Input
                    ref={keywordInputRef}
                    placeholder="Enter keyword"
                    autoComplete="off"
                    value={newKeyword}
                    onChange={(e) => setNewKeyword(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && addKeyword()}
                    className="flex-1 bg-white/5 border-white/20"
                    onFocus={() => setIsNewKeywordInputFocused(true)}
                  />
                  {newKeywordIsInputFocused &&
                    keywordSearchResults &&
                    keywordSearchResults?.length > 0
                     && (
                      <div className="absolute z-10 mt-1 w-full bg-deep-plum/95 border border-white/20 rounded-md shadow-lg divide-y divide-white/10 max-h-60 overflow-y-auto">
                        {keywordSearchResults?.map((topic: string) => (
                          <div
                            key={topic}
                            onClick={() => selectKeyword(topic)}
                            className="px-3 py-3 flex items-center gap-2 hover:bg-white/10 cursor-pointer"
                          >
                            <Hash size={14} className="text-glass-blue/80" />
                            <span className="text-off-white">{topic}</span>
                          </div>
                        ))}
                      </div>
                    )}
                </div>
                <Button
                  onClick={addKeyword}
                  disabled={!newKeyword.trim()}
                  size="sm"
                  variant="outline"
                  className="bg-white/5 border-white/20"
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              {providerData?.interruptRules?.keywords?.length > 0 && (
                <div className="flex flex-wrap gap-2">
                  {providerData?.interruptRules?.keywords?.map(
                    (keyword, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="flex items-center gap-1 bg-white/10 text-text-primary"
                      >
                        "{keyword}"
                        <button
                          onClick={() => removeKeyword(index)}
                          className="ml-1 hover:text-red-400"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    )
                  )}
                </div>
              )}
            </div>

            <Separator className="bg-white/10" />

            {/* System Alerts */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2 mb-4">
                <Bell className="h-5 w-5 text-text-secondary" />
                <h3 className="text-lg font-medium text-text-primary">
                  System Alerts
                </h3>
              </div>
              <p className="text-sm text-text-secondary">
                Select monitoring and alerting systems that can interrupt for
                critical infrastructure issues.
              </p>

              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {systemAlertOptions.map((alert) => (
                  <button
                    key={alert}
                    onClick={() => toggleSystemAlert(alert)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      providerData?.interruptRules?.systemAlerts.includes(alert)
                        ? "bg-primary/20 border-primary/40 text-primary"
                        : "bg-white/5 border-white/20 text-text-secondary hover:border-white/30"
                    }`}
                  >
                    {alert}
                  </button>
                ))}
              </div>

              {providerData?.interruptRules?.systemAlerts.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm text-text-secondary mb-2">
                    Active system alerts:
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {providerData?.interruptRules?.systemAlerts.map((alert) => (
                      <Badge
                        key={alert}
                        variant="outline"
                        className="bg-primary/10 text-primary border-primary/30"
                      >
                        {alert}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <div className="bg-blue-500/10 border border-blue-500/20 rounded-lg p-4">
            <div className="flex items-start space-x-3">
              <Shield className="h-5 w-5 text-blue-400 mt-0.5" />
              <div>
                <h3 className="font-medium text-text-primary">How it works</h3>
                <p className="text-sm text-text-secondary mt-1">
                  When an interrupt rule triggers, Brief-me sends an OS-level
                  notification that bypasses Focus Mode and Do Not Disturb. The
                  triggering event is then discarded and won't appear in your
                  later summaries to keep them clean.
                </p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default InterruptRules;
