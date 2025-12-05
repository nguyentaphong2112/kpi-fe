// import {EventData} from '../form-schema';

export interface ICorrector {
    correct(event: any): any;

}

export class UpperCorrector implements ICorrector {
    correct(event: any) {
        const value = event.value;
        if (value == null || value == '') return value;
        return String(value).toUpperCase();
    }
}

export class LowerCorrector implements ICorrector {
    correct(event: any) {
        const value = event.value;
        if (value == null || value == '') return value;
        return String(value).toLowerCase();
    }
}

export class TrimCorrector implements ICorrector {
    correct(event: any) {
        const value = event.value;
        if (value == null || value == '') return value;
        return String(value).trim();
    }
}

// export class TrimEndCorrector implements ICorrector {
//     correct(event: any) {
//         const value = event.value;
//         if (value == null || value == '') return value;
//         return String(value).trimEnd();
//     }
// }
//
// export class TrimStartCorrector implements ICorrector {
//     correct(event: any) {
//         const value = event.value;
//         if (value == null || value == '') return value;
//         return String(value).trimStart();
//     }
// }

export class GmailCorrector implements ICorrector {
    correct(event: any) {
        const value = event.value;
        if (value == null || value == '') return value;
        if (value.endsWith('@')) return value + 'gmail.com';
        return value;
    }
}
