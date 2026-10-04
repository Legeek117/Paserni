// Calendar export utilities



  

export const generateICSFile = (events: Array<{
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}>, country: string = 'benin') => {
  const formatDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  let icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    'PRODID:-//Espace Paserni//Events//FR',
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH'
  ];
  events.forEach((event, index) => {
    icsContent.push(
      'BEGIN:VEVENT',
      `UID:${Date.now()}-${index}@espacepaserni.com`,
      `DTSTART:${formatDate(event.start)}`,
      `DTEND:${formatDate(event.end)}`,
      `SUMMARY:${event.title}`,
      `DESCRIPTION:${event.description || ''}`,
      `LOCATION:${event.location || (country === 'cote-ivoire' ? 'Espace Paserni, Abidjan, Côte d\'Ivoire' : 'Espace Paserni, Porto-Novo, Bénin')}`,
      'STATUS:CONFIRMED',
      'END:VEVENT'
    );
  });
  icsContent.push('END:VCALENDAR');
  return icsContent.join('\r\n');
};

export const downloadICSFile = (events: any[], filename = 'espace-paserni-events.ics', country: string = 'benin') => {
  const icsContent = generateICSFile(events, country);
  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};


export const generateGoogleCalendarUrl = (event: {
  title: string;
  start: Date;
  end: Date;
  description?: string;
  location?: string;
}, country: string = 'benin') => {
  const formatGoogleDate = (date: Date) => {
    return date.toISOString().replace(/[-:]/g, '').split('.')[0] + 'Z';
  };
  const params = new URLSearchParams({
    action: 'TEMPLATE',
    text: event.title,
    dates: `${formatGoogleDate(event.start)}/${formatGoogleDate(event.end)}`,
    details: event.description || '',
    location: event.location || (country === 'cote-ivoire' ? 'Espace Paserni, Abidjan, Côte d\'Ivoire' : 'Espace Paserni, Porto-Novo, Bénin')
  });
  return `https://calendar.google.com/calendar/render?${params.toString()}`;
};
