import { component$, useStore } from '@builder.io/qwik';
import type { DocumentHead } from '@builder.io/qwik-city';
import { Link } from '@builder.io/qwik-city';



export default component$(() => {
  // Generate Data
  const dates = {};
  const displayDates  = {};

  function getDatesInRange(startDate, endDate, dateobj) {
    const date = new Date(startDate.getTime());
  
    // // ✅ Exclude start date
    // date.setDate(date.getDate() + 1);
  
    let houseIndex = 0;
  
    // ✅ Exclude end date
    while (date <= endDate) {
      const tanggal = new Date(date);
      const key = `${tanggal.getFullYear().toString()}${(tanggal.getMonth()+1).toString().padStart(2, '0')}${tanggal.getDate().toString()}`;
      dateobj[key] = {
        date: tanggal,
        day: tanggal.getDate(),
        dayName: tanggal.toLocaleDateString('id', { weekday: 'long' }),
        month: tanggal.getMonth(),
        monthName: tanggal.toLocaleDateString('id', { month: 'long' }),
        year: tanggal.getFullYear(),
        house: houses[houseIndex]
      };
      date.setDate(date.getDate() + 1);
      if(houseIndex == houses.length - 1) {
        houseIndex = 0;
      } else {
        houseIndex++;
      }
      // houseIndex = (houseIndex <= houses.length && houseIndex > 0) ? houseIndex+1 : 0;
    }
  
    return dateobj;
  }
  
  const d1 = new Date('2022-11-03');
  const d2 = new Date('2022-12-31');
  
  const houses = ['A2', 'A3', 'A5', 'A7', 'A8', 'A9', 'A10', 'B1', 'B3', 'B5', 'B6', 'B7', 'B8', 'B9'];
  const jadwal = useStore(getDatesInRange(d1, d2, dates));

  // Generate View
  const display_start_date = new Date(new Date().setDate(new Date().getDate() - 2));
  const display_end_date = new Date(new Date().setDate(new Date().getDate() + 2));
  // console.log(display_start_date, display_end_date)

  const data = useStore({
    active_date: parseInt(new Date().getDate().toString()),
    display_start_date: display_start_date.getDate(),
    display_end_date: display_end_date.getDate(),
  });

  const activelist = useStore(getDatesInRange(display_start_date, display_end_date, displayDates));
  // console.log(activelist);

  const displayActiveList = () => {
    const content = [];

    for(const item in activelist) {
      const is_todays_date = data.active_date == activelist[item].day ? 'active-date' : '';
      content.push(
        <div key={item} className={`roster-card ${is_todays_date} w-[150px] h-[300px] bg-white rounded-md shadow-lg flex-none p-5 mr-5 flex flex-col`}>
          <h2 className="font-italic">{activelist[item].dayName}</h2>
          <h3 className="font-bold italic text-slate-700">{activelist[item].day} {activelist[item].monthName}</h3> 
          <hr className="my-5" />
          <div className="grid place-items-center text-[72px] text-slate-900 font-bold flex-1">
            {jadwal[item].house}
          </div>
        </div>
      )
    }

    return content;
  }

  const layerX = {};
  const posMap = [120, -50, -200, -400, -550];
  let idx = 0;
  for(const i in activelist) {
    layerX[activelist[i].day] = posMap[idx];
    idx++;
  }
  console.log(layerX);

  return (
    <div className="text-slate-400 w-[600px] max-w-[600px] text-center">
      <h1 className="font-bold uppercase">JADWAL KUNCI GERBANG</h1>
      <h2 className="font-bold text-4xl uppercase text-slate-800">CLUSTER ASTER II</h2>
      <hr className="my-5" />
      <div className="overflow w-[500px] mx-auto p-5 relative mt-[50px]">
        <button className="arrow-btn left-[0px]" onClick$={() => {
          if(data.active_date > data.display_start_date) data.active_date--;
         }}>🡠</button>
        <div className="flex overflow p-5" style={{ transform: `translateX(${layerX[data.active_date]}px)`, transition: 'all .32s ease' }}>{displayActiveList()}</div>
        <button className="arrow-btn right-[0px]" onClick$={() => data.active_date < data.display_end_date ? data.active_date++ : false }>🡢</button>
      </div>
      
    </div>
  );
});

export const head: DocumentHead = {
  title: 'Welcome to Qwik',
  meta: [
    {
      name: 'description',
      content: 'Cluster Aster II Palembang Gate Roster Schedule',
    },
  ],
};
