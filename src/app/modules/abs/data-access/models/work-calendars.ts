import { WorkCalendarOrgs } from "./work-calendar-orgs";

export class WorkCalendars {
    workCalendarId?: number;
    name?: string;
    monWorkTime?: string;
    tueWorkTime?: string;
    wedWorkTime?: string;
    thuWorkTime?: string;
    friWorkTime?: string;
    satWorkTime?: string;
    sunWorkTime?: string;
    defaultHolidayDate?: string;
    startDate?: any;
    endDate?: any;

    listWorkCalendarOrgs?: WorkCalendarOrgs[];
}
