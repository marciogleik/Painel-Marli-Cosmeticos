export interface PositionedAppointment<T> {
    appt: T;
    overlapIndex: number;
    overlapCount: number;
}

export const resolveOverlaps = <T extends { start_time: string | null; end_time: string | null }>(
    appts: T[]
): PositionedAppointment<T>[] => {
    if (appts.length === 0) return [];

    // Sort by start time
    const sorted = [...appts].sort((a, b) => {
        const startA = a.start_time || "00:00:00";
        const startB = b.start_time || "00:00:00";
        return startA.localeCompare(startB);
    });

    const result: PositionedAppointment<T>[] = [];
    let currentGroup: T[] = [];
    let groupEndTime = "00:00:00";

    const processGroup = (group: T[]) => {
        if (group.length === 0) return;

        const columns: T[][] = [];

        group.forEach(appt => {
            let placed = false;
            for (let i = 0; i < columns.length; i++) {
                const lastInCol = columns[i][columns[i].length - 1];
                if ((lastInCol.end_time || "00:00:00") <= (appt.start_time || "00:00:00")) {
                    columns[i].push(appt);
                    placed = true;
                    break;
                }
            }
            if (!placed) {
                columns.push([appt]);
            }
        });

        const overlapCount = columns.length;
        columns.forEach((col, overlapIndex) => {
            col.forEach(appt => {
                result.push({ appt, overlapIndex, overlapCount });
            });
        });
    };

    sorted.forEach(appt => {
        const apptStart = appt.start_time || "00:00:00";
        if (currentGroup.length > 0 && apptStart >= groupEndTime) {
            processGroup(currentGroup);
            currentGroup = [];
            groupEndTime = "00:00:00";
        }

        currentGroup.push(appt);
        const apptEnd = appt.end_time || "00:00:00";
        if (apptEnd > groupEndTime) {
            groupEndTime = apptEnd;
        }
    });

    processGroup(currentGroup);

    return result;
};
