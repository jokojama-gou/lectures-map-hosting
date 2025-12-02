import React, { useState, useEffect } from 'react';
import './TimeTable.css';

const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

const LINKS = {
  'Mon-1': `${import.meta.env.BASE_URL}maps_imgs/月1.png`,
  'Mon-2': `${import.meta.env.BASE_URL}maps_imgs/月2.png`,
  'Mon-3': `${import.meta.env.BASE_URL}maps_imgs/月3.png`,
  'Mon-4': `${import.meta.env.BASE_URL}maps_imgs/月4.png`,
  'Mon-5': `${import.meta.env.BASE_URL}maps_imgs/月5.png`,
  'Mon-6': `${import.meta.env.BASE_URL}maps_imgs/月6.png`,
  'Mon-7': `${import.meta.env.BASE_URL}maps_imgs/月7.png`,
  'Tue-1': `${import.meta.env.BASE_URL}maps_imgs/火1.png`,
  'Tue-2': `${import.meta.env.BASE_URL}maps_imgs/火2.png`,
  'Tue-3': `${import.meta.env.BASE_URL}maps_imgs/火3.png`,
  'Tue-4': `${import.meta.env.BASE_URL}maps_imgs/火4.png`,
  'Tue-5': `${import.meta.env.BASE_URL}maps_imgs/火5.png`,
  'Tue-6': `${import.meta.env.BASE_URL}maps_imgs/火6.png`,
  'Tue-7': `${import.meta.env.BASE_URL}maps_imgs/火7.png`,
  'Wed-1': `${import.meta.env.BASE_URL}maps_imgs/水1.png`,
  'Wed-2': `${import.meta.env.BASE_URL}maps_imgs/水2.png`,
  'Wed-3': `${import.meta.env.BASE_URL}maps_imgs/水3.png`,
  'Wed-4': `${import.meta.env.BASE_URL}maps_imgs/水4.png`,
  'Wed-5': `${import.meta.env.BASE_URL}maps_imgs/水5.png`,
  'Wed-6': `${import.meta.env.BASE_URL}maps_imgs/水6.png`,
  'Wed-7': `${import.meta.env.BASE_URL}maps_imgs/水7.png`,
  'Thu-1': `${import.meta.env.BASE_URL}maps_imgs/木1.png`,
  'Thu-2': `${import.meta.env.BASE_URL}maps_imgs/木2.png`,
  'Thu-3': `${import.meta.env.BASE_URL}maps_imgs/木3.png`,
  'Thu-4': `${import.meta.env.BASE_URL}maps_imgs/木4.png`,
  'Thu-5': `${import.meta.env.BASE_URL}maps_imgs/木5.png`,
  'Thu-6': `${import.meta.env.BASE_URL}maps_imgs/木6.png`,
  'Thu-7': `${import.meta.env.BASE_URL}maps_imgs/木7.png`,
  'Fri-1': `${import.meta.env.BASE_URL}maps_imgs/金1.png`,
  'Fri-2': `${import.meta.env.BASE_URL}maps_imgs/金2.png`,
  'Fri-3': `${import.meta.env.BASE_URL}maps_imgs/金3.png`,
  'Fri-4': `${import.meta.env.BASE_URL}maps_imgs/金4.png`,
  'Fri-5': `${import.meta.env.BASE_URL}maps_imgs/金5.png`,
  'Fri-6': `${import.meta.env.BASE_URL}maps_imgs/金6.png`,
  'Fri-7': `${import.meta.env.BASE_URL}maps_imgs/金7.png`,
};

const TimeTable = () => {
  const [periods, setPeriods] = useState([]);
  const [currentSlot, setCurrentSlot] = useState({ dayIndex: -1, periodId: -1 });

  useEffect(() => {
    fetch(`${import.meta.env.BASE_URL}periods.json`)
      .then(res => res.json())
      .then(data => setPeriods(data))
      .catch(err => console.error('Failed to load periods:', err));
  }, []);

  // 現在時刻の判定ロジック
  useEffect(() => {
    const checkTime = () => {
      const now = new Date();
      const currentDayIndex = now.getDay() - 1; // 0=Sun, 1=Mon... -> 配列用(0=Mon)に調整
      const currentMinutes = now.getHours() * 60 + now.getMinutes();

      let activePeriodId = -1;


      if (currentDayIndex >= 0 && currentDayIndex < 6) {
        periods.forEach(p => {
          const [sH, sM] = p.start.split(':').map(Number);
          const [eH, eM] = p.end.split(':').map(Number);
          const startMin = sH * 60 + sM;
          const endMin = eH * 60 + eM;

          if (currentMinutes >= startMin && currentMinutes <= endMin) {
            activePeriodId = p.id;
          }
        });
      }

      setCurrentSlot({ dayIndex: currentDayIndex, periodId: activePeriodId });
    };

    checkTime();
    const timer = setInterval(checkTime, 60000); // 1分ごとに更新
    return () => clearInterval(timer);
  }, [periods]);

  // 次のコマを計算する関数
  const getNextSlot = () => {
    if (currentSlot.dayIndex === -1 || currentSlot.periodId === -1) {
      return null;
    }

    // 同じ曜日の次の時限を探す
    const nextPeriod = periods.find(p => p.id === currentSlot.periodId + 1);
    if (nextPeriod) {
      return { dayIndex: currentSlot.dayIndex, periodId: nextPeriod.id };
    }

    // 同じ曜日に次の時限がない場合、次の曜日の1限目
    const nextDayIndex = currentSlot.dayIndex + 1;
    if (nextDayIndex < DAYS.length && periods.length > 0) {
      return { dayIndex: nextDayIndex, periodId: 1 };
    }

    return null;
  };

  const nextSlot = getNextSlot();

  // 曜日名を日本語に変換
  const dayLabels = ['月', '火', '水', '木', '金'];

  return (
    <div className="timetable-container">
      <div className="grid-header">
        <div className="cell empty"></div>
        {DAYS.map(day => <div key={day} className="cell header-day">{day}</div>)}
      </div>

      <div className="grid-body">
        {periods.map((period) => (
          <React.Fragment key={period.id}>
            {/* 時限表示列 */}
            <div className="cell period-time">
              <span className="p-num">{period.id}</span>
              <span className="p-range">{period.start}<br />{period.end}</span>
            </div>

            {/* 各曜日のセル */}
            {DAYS.map((day, dayIndex) => {
              const key = `${day}-${period.id}`;
              const linkUrl = LINKS[key] || '#'; // リンクがない場合は#
              const isCurrent = (dayIndex === currentSlot.dayIndex) && (period.id === currentSlot.periodId);

              return (
                <a
                  key={key}
                  href={linkUrl}
                  className={`cell class-slot ${isCurrent ? 'active' : ''}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <div className="slot-content">
                    {/* 科目名は入れないが、タップ判定用の透明な箱として機能 */}
                  </div>
                </a>
              );
            })}
          </React.Fragment>
        ))}
      </div>

      {/* 現在と次のコマ情報 */}
      <div className="period-info">
        {currentSlot.dayIndex !== -1 && currentSlot.periodId !== -1 ? (
          <div className="current-period">
            現在のコマ：{dayLabels[currentSlot.dayIndex]}{currentSlot.periodId}
          </div>
        ) : (
          <div className="current-period">
            現在のコマ：なし
          </div>
        )}

        {nextSlot ? (
          <div className="next-period">
            次のコマ：{dayLabels[nextSlot.dayIndex]}{nextSlot.periodId}
          </div>
        ) : (
          <div className="next-period">
            次のコマ：なし
          </div>
        )}
      </div>
    </div>
  );
};

export default TimeTable;
