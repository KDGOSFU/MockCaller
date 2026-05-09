import { RTCPeerConnection, RTCSessionDescription} from 'wrtc';

//Each session stores:

interface SessionState{
    sessionId: string;
    dbSessionId: string;
    peerConnection: RTCPeerConnection;
    openaiSessionId: string | null;
    clientSecret: string;
    personaId: string;
    scenarioId: string;
    createdAt: Date;
    status : 'PENDING_ANSWER' | 'CONNECTED' | 'ENDED';
    audiotrack?: MediaStreamTrack;
}

//Manager to handle all session
class SessionManager{
    private sessions: Map<string, SessionState> = new Map();

    createSession(
        sessionId: string,
        dbSessionId: string,
        peerConnection: RTCPeerConnection,
        openaiSessionId: string | null,
        clientSecret: string,
        personaId: string,
        scenarioId: string,
    ): SessionState{
        const session: SessionState = {
            sessionId,
            dbSessionId,
            peerConnection,
            openaiSessionId,
            clientSecret,
            personaId,
            scenarioId,
            createdAt: new Date(),
            status: 'PENDING_ANSWER',
        };

        this.sessions.set(sessionId, session);
        return session;
    }

    updateSessionStatus(
        sessionId: string,
        status : 'PENDING_ANSWER' | 'CONNECTED' | 'ENDED'
    ): void{
        const session = this.sessions.get(sessionId)
        if(session){
            session.status = status;
        }
    }

    deleteSession(sessionId: string): void{
        const session = this.sessions.get(sessionId);
        if(session){
            session.peerConnection.close();
            this.sessions.delete(sessionId);
        }
    }

    getAllSessions(): SessionState[] {
        return Array.from(this.sessions.values());
    }

    cleanupExpiredSessions(maxAgeMs: number = 30*60*1000):void{
        const now = new Date();
        for (const [sessionId, session] of this.sessions){
            const ageMs = now.getTime() - session.createdAt.getTime();
            if (ageMs > maxAgeMs){
                this.deleteSession(sessionId);
            }
        }
    }
}

export const sessionManager = new SessionManager()