import styles from "./Friend.module.scss";
import { UserDetail, Conversation, UserPlus } from "@styled-icons/boxicons-solid";

import { Friend } from "./Friend";
import { Text } from "preact-i18n";
import Header from "../../components/ui/Header";
import Overline from "../../components/ui/Overline";
import IconButton from "../../components/ui/IconButton";
import { useUsers } from "../../context/revoltjs/hooks";
import { User, Users } from "revolt.js/dist/api/objects";
import { isTouchscreenDevice } from "../../lib/isTouchscreenDevice";
import { useIntermediate } from "../../context/intermediate/Intermediate";

export default function Friends() {
    const { openScreen } = useIntermediate();

    const users = useUsers() as User[];
    users.sort((a, b) => a.username.localeCompare(b.username));

    const pending = users.filter(
        x =>
            x.relationship === Users.Relationship.Incoming ||
            x.relationship === Users.Relationship.Outgoing
    );
    const friends = users.filter(
        x => x.relationship === Users.Relationship.Friend
    );
    const blocked = users.filter(
        x => x.relationship === Users.Relationship.Blocked
    );

    const online = friends.filter(x => x.online && x.status?.presence !== Users.Presence.Invisible);
    const offline = friends.filter(x => !x.online || x.status?.presence === Users.Presence.Invisible);

    return (
        <>
            <Header placement="primary">
                { !isTouchscreenDevice && <UserDetail size={24} /> }
                <div className={styles.title}>
                    <Text id="app.navigation.tabs.friends" />
                </div>
                <IconButton onClick={() => openScreen({ id: 'special_input', type: 'create_group' })}>
                    <Conversation size={24} />
                </IconButton>
                <IconButton onClick={() => openScreen({ id: 'special_input', type: 'add_friend' })}>
                    <UserPlus size={24} />
                </IconButton>
            </Header>
            <div
                className={styles.list}
                data-empty={
                    pending.length + friends.length + blocked.length === 0
                }
            >
                {pending.length + friends.length + blocked.length === 0 && (
                    <>
                        <img src="https://img.insrt.uk/xexu7/XOPoBUTI47.png/raw" />
                        <Text id="app.special.friends.nobody" />
                    </>
                )}
                {pending.length > 0 && (
                    <Overline className={styles.overline} type="subtle">
                        <Text id="app.special.friends.pending" /> —{" "}
                        {pending.length}
                    </Overline>
                )}
                {pending.map(y => (
                    <Friend key={y._id} user={y} />
                ))}
                {online.length > 0 && (
                    <Overline className={styles.overline} type="subtle">
                        <Text id="app.status.online" /> —{" "}
                        {online.length}
                    </Overline>
                )}
                {online.map(y => (
                    <Friend key={y._id} user={y} />
                ))}
                {offline.length > 0 && (
                    <Overline className={styles.overline} type="subtle">
                        <Text id="app.status.offline" /> —{" "}
                        {offline.length}
                    </Overline>
                )}
                {offline.map(y => (
                    <Friend key={y._id} user={y} />
                ))}
                {blocked.length > 0 && (
                    <Overline className={styles.overline} type="subtle">
                        <Text id="app.special.friends.blocked" /> —{" "}
                        {blocked.length}
                    </Overline>
                )}
                {blocked.map(y => (
                    <Friend key={y._id} user={y} />
                ))}
            </div>
        </>
    );
}
