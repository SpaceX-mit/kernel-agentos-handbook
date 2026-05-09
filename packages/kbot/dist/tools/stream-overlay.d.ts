export type AlertType = 'follow' | 'raid' | 'sub' | 'donation' | 'achievement';
export interface StreamAlert {
    type: AlertType;
    username: string;
    viewers?: number;
    amount?: number;
    title?: string;
    message?: string;
}
export interface GoalConfig {
    id: string;
    label: string;
    current: number;
    target: number;
    color?: string;
    position?: 'top' | 'bottom';
}
export interface InfoBarData {
    viewers: number;
    uptime: string;
    biome: string;
    chatRate: number;
}
export declare class StreamOverlay {
    private alertQueue;
    private activeAlert;
    private goals;
    private goalAnimations;
    private tickerItems;
    private tickerSpeed;
    private highlight;
    private infoBar;
    queueAlert(alert: StreamAlert): void;
    setGoal(goal: GoalConfig): void;
    updateGoal(id: string, current: number): void;
    addTicker(text: string): void;
    highlightMessage(username: string, message: string, color?: string): void;
    updateInfoBar(info: InfoBarData): void;
    tick(_frame: number): void;
    render(ctx: CanvasRenderingContext2D, width: number, height: number): void;
    private tickAlerts;
    private renderAlert;
    private tickGoals;
    private renderGoals;
    private tickTicker;
    private renderTicker;
    private tickHighlight;
    private renderHighlight;
    /**
     * The folio strip — magazine masthead translated into broadcast chrome.
     * Layout (left → right):
     *   ★  KERNEL.CHAT · LIVE  ·  VIEWERS {n}  ·  UPTIME {t}  ·  CHAT {n}/MIN  ·  BIOME {b}    LIVE TRANSMISSION · 生放送
     *
     * Single hairline above. Cream ground. Ink type. Tomato spot on the
     * leading ★ and the live tagline. Mirrors `.pop-folio` on the site,
     * minus the issue-number monument — broadcasts don't carry issues.
     */
    private renderInfoBar;
}
export declare function getOverlay(): StreamOverlay;
export declare function registerOverlayTools(): void;
//# sourceMappingURL=stream-overlay.d.ts.map