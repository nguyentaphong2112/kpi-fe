export class WorkCalendarOrgs {
    workCalendarOrgId?: number;
    workCalendarId?: number;
    orgId?: number;
    org?: Organization;
    fromYear?: number;
    toYear?: number;
    fromDate?: string | Date | null;
    toDate?: string | Date | null;
}

interface Organization {
  orgId: number
}
