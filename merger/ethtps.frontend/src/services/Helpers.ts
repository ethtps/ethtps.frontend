import { DataResponseModel, TimeInterval } from "./api-client/src/models";

export const transformIntervalName = (interval: string) => {
    switch (interval) {
        case '1h':
            return 'OneHour';
        case '1d':
            return 'OneDay';
        case '1w':
            return 'OneWeek';
        case '1m':
            return 'OneMonth';
        case '1y':
            return 'OneYear';
        case 'All':
            return 'All';
        default:
            return 'OneMonth';
    }
}

export const reverseTransformIntervalName = (interval: string) => {
    switch (interval) {
        case 'OneHour':
            return '1h';
        case 'OneDay':
            return '1d';
        case 'OneWeek':
            return '1w';
        case 'OneMonth':
            return '1m';
        case 'OneYear':
            return '1y';
        case 'All':
            return 'All';
        default:
            return 'OneMonth';
    }
}

export const createDataPoint = (x: DataResponseModel) => {
    return {
        x: x.data[0].date,
        y: x.data[0].value
    }
}

export const monthNames = ["January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
];

export const extractLabel = (selectedYear: Number, interval: TimeInterval, x: Date) => {
    try {
        if (selectedYear !== 0) {
            return monthNames[x.getMonth()].substr(0, 3) + " " + x.getFullYear();
        }
        switch (interval) {
            case TimeInterval.OneHour:
                return x.getHours() + ":" + ((x.getMinutes() < 10) ? ("0" + x.getMinutes()) : x.getMinutes());
            case TimeInterval.OneDay:
                return x.getHours() + ":00";
            case TimeInterval.OneWeek:
                return monthNames[x.getMonth()].substr(0, 3) + " " + (x.getDate()) + " " + x.getHours() + ":00";
            case TimeInterval.OneMonth:
                return monthNames[x.getMonth()].substr(0, 3) + " " + (x.getDate());
            case TimeInterval.OneYear:
                return monthNames[x.getMonth()].substr(0, 3) + " " + x.getFullYear();
            case TimeInterval.All:
                return monthNames[x.getMonth()].substr(0, 3) + " " + x.getFullYear();
            default:
                return x;
        }
    }
    catch {
        return "";
    }
}

export const numberFormat = new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 3
});