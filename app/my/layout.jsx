"use client";

import useMediaQuery from "@mui/material/useMediaQuery";

import { useState, useEffect, createContext, use } from "react";
import { SessionProvider } from "next-auth/react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";

import FullDesktopNav from "#/client/full-desktop-nav";
import MiniDesktopNav from "#/client/mini-desktop-nav";
import Header from "#/client/header";

import "./layout.css";

const BottomNav = dynamic(() => import("#/client/bottom-nav"));

const UserContext = createContext();
const KeysContext = createContext();
const NotificationsContext = createContext();

export default function MyLayout({ children }) {
  const isMediumScreen = useMediaQuery("(min-width: 1260px)");
  const router = useRouter();

  const [notifications, setNotifications] = useState(null);
  const [openSidebar, setOpenSidebar] = useState(true);
  const [stretch, setStretch] = useState(true);
  const [user, setUser] = useState(null);
  const [keys, setKeys] = useState(null);

  useEffect(() => {
    fetch("/api/bebra")
      .then((res) => res.json())
      .then((data) => {
        if (data === null) {
          setUser(false);
        } else {
          setUser(data[0]);
          setKeys(data[1]);
          fetch(
            `${process.env.NEXT_PUBLIC_BACKEND_URL}/resourses/notifications`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                "X-TRADIFY-UID": data[0].id,
              },
            }
          )
            .then((res) => res.json())
            .then((res) =>
              setNotifications(
                res.sort(
                  (a, b) => new Date(b.created_at) - new Date(a.created_at)
                )
              )
            );
        }
      });
    setOpenSidebar(JSON.parse(localStorage.getItem("sidebar")) ?? true);
    setStretch(JSON.parse(localStorage.getItem("stretch")) ?? true);
  }, []);

  if (user === false) {
    router.push("/login");
  } else if (user !== null) {
    return (
      <>
        <Header
          keys={keys}
          id={user.id}
          stretch={stretch}
          email={user.email}
          unread={user.unread}
          username={user.name}
          setStretch={setStretch}
          openSidebar={openSidebar}
          privateMode={user.private}
          convertMode={user.convert}
          notifications={notifications}
          setNotifications={setNotifications}
        />
        <div style={{ display: "flex" }}>
          {isMediumScreen && (
            <nav
              style={{
                width: openSidebar ? "280px" : "90px",
              }}
            >
              {openSidebar ? (
                <FullDesktopNav
                  keys={keys}
                  username={user.name}
                  privateMode={user.private}
                  convertMode={user.convert}
                  setOpenSidebar={setOpenSidebar}
                  activate={Boolean(user.activated_at)}
                />
              ) : (
                <MiniDesktopNav setOpenSidebar={setOpenSidebar} />
              )}
            </nav>
          )}
          <main
            className="layout"
            style={{
              maxWidth: stretch ? "1600px" : "100%",
            }}
          >
            <UserContext value={{ user, setUser }}>
              <KeysContext value={{ keys, setKeys }}>
                <NotificationsContext
                  value={{ notifications, setNotifications }}
                >
                  <SessionProvider>{children}</SessionProvider>
                </NotificationsContext>
              </KeysContext>
            </UserContext>
          </main>
          {!isMediumScreen && <BottomNav />}
        </div>
      </>
    );
  }
}

export function useUser() {
  return use(UserContext);
}

export function useKeys() {
  return use(KeysContext);
}

export function useNotifications() {
  return use(NotificationsContext);
}
