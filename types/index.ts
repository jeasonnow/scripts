export interface AbstractClaimTool {
    claim: () => void;
}

export interface IpResponse {
    code: number;
    data: string[];
    msg: string;
}