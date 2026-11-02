"use client";

import CourierBoard from "../components/CourierBoard";

export default function CompletedPage() {
  return (
    <CourierBoard
      lockedTab="yakunlangan"
      searchable
      heading="Yakunlanganlar"
      subheading="Yetkazilgan topshiriqlar"
    />
  );
}
