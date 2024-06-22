"use client";

import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";

import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";

import TabsContent from "#/client/Account/tabs-content";
import IconBox from "#/components/icon-box";
import Iconify from "#/components/iconify";

export default function TabsWrapper() {
  const [value, setValue] = useState(0);

  return (
    <>
      <Tabs
        value={value}
        onChange={(e, n) => setValue(n)}
        sx={{
          maxWidth: { xs: 360, sm: 480 },
        }}
      >
        <Tab
          label="Основное"
          disableTouchRipple
          iconPosition="start"
          icon={
            <Iconify icon="solar:user-id-bold" sx={{ marginRight: "8px" }} />
          }
        />
        <Tab
          label="Ключи"
          disableTouchRipple
          iconPosition="start"
          icon={
            <Iconify
              icon="solar:key-minimalistic-square-bold"
              sx={{ marginRight: "8px" }}
            />
          }
        />
        <Tab
          label="Безопасность"
          disableTouchRipple
          iconPosition="start"
          icon={<IconBox iconUrl="/svg/security.svg" iconMarginRight="8px" />}
        />
      </Tabs>
      <div style={{ marginBottom: 40 }} />
      {/* <AnimatePresence mode="wait">
        <motion.div
          key={value}
          initial={{ y: 10, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -10, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <TabsContent value={value} />
        </motion.div>
      </AnimatePresence> */}
      <TabsContent value={value} />
    </>
  );
}
