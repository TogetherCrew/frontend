export default interface IBreakdown {
  isActiveMembersBreakdownLoading: boolean;
  isOnboardingMembersBreakdownLoading: boolean;
  isDisengagedMembersCompositionBreakdownLoading: boolean;
  isRolesLoading: boolean;
  roles: any[];
  getActiveMemberCompositionTable: (
    guild_id: string,
    activityComposition: string[],
    roles: string[],
    username?: string,
    sortBy?: string,
    page?: number,
    limit?: number
  ) => any;
  getOnboardingMemberCompositionTable: (
    guild_id: string,
    activityComposition: string[],
    roles: string[],
    username?: string,
    sortBy?: string,
    page?: number,
    limit?: number
  ) => any;
  getDisengagedMembersCompositionTable: (
    guild_id: string,
    activityComposition: string[],
    roles: string[],
    username?: string,
    sortBy?: string,
    page?: number,
    limit?: number
  ) => any;
  getRoles: (guild_id: string) => any;
}
