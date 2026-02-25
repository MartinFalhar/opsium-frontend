import React, { useState, useEffect } from "react";
import { useUser } from "../../context/UserContext";

const API_URL = import.meta.env.VITE_API_URL;

function AdminDashboard({ client }) {
  const [opsiumInfo, setOpsiumInfo] = useState({});
  const [upcomingEvents, setUpcomingEvents] = useState([]);
  const [error, setError] = useState(null);
  const { user } = useUser();

  const getMonthDay = (value) => {
    if (!value) {
      return null;
    }

    const dateString = String(value).trim();

    const dayMonthText = dateString.match(
      /^(\d{1,2})\.(\d{1,2})(?:\.|\.\d{2,4})?$/,
    );
    if (dayMonthText) {
      const day = Number(dayMonthText[1]);
      const month = Number(dayMonthText[2]);
      if (day >= 1 && day <= 31 && month >= 1 && month <= 12) {
        return { day, month };
      }
    }

    const isoMatch = dateString.match(/^(\d{4})-(\d{2})-(\d{2})/);
    if (isoMatch) {
      return {
        month: Number(isoMatch[2]),
        day: Number(isoMatch[3]),
      };
    }

    const parsed = new Date(dateString);
    if (!Number.isNaN(parsed.getTime())) {
      return {
        day: parsed.getDate(),
        month: parsed.getMonth() + 1,
      };
    }

    return null;
  };

  const getDaysUntil = ({ day, month }) => {
    const today = new Date();
    const todayStart = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate(),
    );

    let target = new Date(todayStart.getFullYear(), month - 1, day);
    if (target < todayStart) {
      target = new Date(todayStart.getFullYear() + 1, month - 1, day);
    }

    return Math.round((target - todayStart) / (1000 * 60 * 60 * 24));
  };

  const formatDayMonth = ({ day, month }) => {
    const dayText = String(day).padStart(2, "0");
    const monthText = String(month).padStart(2, "0");
    return `${dayText}.${monthText}.`;
  };

  const mapMembersToUpcomingEvents = (membersList) => {
    const eventsByMember = (membersList || [])
      .map((member) => {
        const fullName = `${member.name || ""} ${member.surname || ""}`.trim();
        const candidates = [];

        const nameDateMonthDay = getMonthDay(member.name_date);
        if (nameDateMonthDay) {
          candidates.push({
            fullName,
            type: "svátek",
            dayMonth: formatDayMonth(nameDateMonthDay),
            daysUntil: getDaysUntil(nameDateMonthDay),
          });
        }

        const birthDateMonthDay = getMonthDay(member.birth_date);
        if (birthDateMonthDay) {
          candidates.push({
            fullName,
            type: "narozeniny",
            dayMonth: formatDayMonth(birthDateMonthDay),
            daysUntil: getDaysUntil(birthDateMonthDay),
          });
        }

        if (candidates.length === 0) {
          return null;
        }

        return candidates.sort((a, b) => a.daysUntil - b.daysUntil)[0];
      })
      .filter(Boolean)
      .sort((a, b) => a.daysUntil - b.daysUntil)
      .slice(0, 3);

    setUpcomingEvents(eventsByMember);
  };

  useEffect(() => {
    const getDashboardData = async () => {
      const [infoRes, membersRes] = await Promise.all([
        fetch(`${API_URL}/admin/adminInfo`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ organization_id: user.organization_id }),
        }),
        fetch(`${API_URL}/admin/members_list`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ organization: user.organization_id }),
        }),
      ]);

      const info = await infoRes.json();
      const members = await membersRes.json();

      if (infoRes.ok) {
        setOpsiumInfo(info);
      } else {
        setError(info?.message || "Chyba načítání admin info");
      }

      if (membersRes.ok && Array.isArray(members)) {
        mapMembersToUpcomingEvents(members);
      } else {
        setUpcomingEvents([]);
      }
    };

    getDashboardData();
  }, [user.organization_id]);

  return (
    <div className="admin-dashboard-container">
      <div className="info-box-2">
        <div className="info-box-header">
          <h6>
            <strong>ADMIN DATA</strong>
          </h6>
        </div>
        <p>{`ID users: ${user.id}`}</p>
        <p>{`Jméno: ${user.name}`}</p>
        <p>{`Příjmení: ${user.surname}`}</p>
        <p>{`Email: ${user.email}`}</p>
        <p>{`ID organizace: ${user.organization_id}`}</p>
        <p>{`Práva: ${user.rights}`}</p>
      </div>

      <div className="info-box">
        <div className="info-box-header">
          <h5>Počet účtů</h5>
        </div>
        <div className="info-box-content">
          <h5>{opsiumInfo.countTotal}</h5>
        </div>
      </div>

      <div className="info-box">
        <div className="info-box-header">
          <h5>Poboček</h5>
        </div>
        <div className="info-box-content">
          <h5>{opsiumInfo.countTotalBranches}</h5>
        </div>
      </div>

      <div className="info-box">
        <div className="info-box-header">
          <h5>Členové</h5>
        </div>
        <div className="info-box-content">
          <h5>{opsiumInfo.countTotalMembers}</h5>
        </div>
      </div>

      <div className="info-box">
        <div className="info-box-header">
          <h5>Klientů</h5>
        </div>
        <div className="info-box-content">
          <h5>{opsiumInfo.countTotalClients}</h5>
        </div>
      </div>

      <div className="info-box info-box-events">
        <div className="info-box-header">
          <h5>Nejbližší svátky / narozeniny</h5>
        </div>
        <div className="info-box-content">
          {upcomingEvents.length === 0 ? (
            <p>Bez dat</p>
          ) : (
            upcomingEvents.map((event, index) => (
              <p key={`${event.fullName}-${event.type}-${index}`}>
                {event.fullName} — {event.type} {event.dayMonth} (
                {event.daysUntil === 0 ? "dnes" : `za ${event.daysUntil} dní`})
              </p>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
