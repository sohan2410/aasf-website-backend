export const reportTempate = (eventDetails) => `
Abhigyan Abhikaushalam Students' Forum
\t.....coalescence of knowledge and skills

Date:
${eventDetails.date}

Venue:
${eventDetails.venue}

Time:
${eventDetails.time}

${eventDetails.organizersHeading}:
${eventDetails.organizers.join("\n")}

${eventDetails.description}

Detailed report has been attached for your kind reference.

Also, these are some photos of the mentioned event.
${eventDetails.photos}
`;
