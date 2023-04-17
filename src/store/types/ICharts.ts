export default interface IHeatmap {
  isLoading: boolean;
  heatmapRecords: any[];
  interactions: {};
  activeMembers: {};
  disengagedMembers: {};
  inactiveMembers: {};
  fetchHeatmapData: (
    guild_id: string,
    startDate: string,
    endDate: string,
    timeZone: string
  ) => any;
  fetchInteractions: (
    guild_id: string,
    startDate: string,
    endDate: string,
    timeZone: string
  ) => any;
  fetchActiveMembers: (
    guild_id: string,
    startDate: string,
    endDate: string,
    timeZone: string
  ) => any;
  fetchDisengagedMembers: (
    guild_id: string,
    startDate: string,
    endDate: string,
    timeZone: string
  ) => any;
  fetchInactiveMembers: (
    guild_id: string,
    startDate: string,
    endDate: string,
    timeZone: string
  ) => any;
}