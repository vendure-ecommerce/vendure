import React from 'react';

export default function MemberInfo(props: { description: string }) {
    return <div className="member-description">{props.description}</div>;
}
