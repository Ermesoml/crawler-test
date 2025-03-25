export interface UrlProperties {
    domain: string;
    path: string;
}

export interface UrlAnalyserResult {
    domain: string;
    path: string;
    status: number;
}

export interface DomainResult {
    validPaths: Array<string>; 
    pathStatus: { [path: string]: number };
}