import { defineDashboardExtension } from '@vendure/dashboard';

defineDashboardExtension({
    customFormComponents: {
        customFields: [
            {
                id: 'test-input',
                component: props => {
                    return (
                        <input
                            placeholder="custom input"
                            value={props.value || ''}
                            onChange={e => props.onChange(e.target.value)}
                            className="border rounded-full"
                        />
                    );
                },
            },
        ],
    },
});
