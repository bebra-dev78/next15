"use client";

import TabSecurity from "#/client/Account/tab-security";
import TabUser from "#/client/Account/tab-user";
import TabKeys from "#/client/Account/tab-keys";

export default function TabsContent({ value }) {
  switch (value) {
    case 0:
      return <TabUser />;
    case 1:
      return <TabKeys />;
    case 2:
      return <TabSecurity />;
    default:
      break;
  }
}
