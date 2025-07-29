import { Button } from '@/vdb/components/ui/button.js';
import { Trans } from '@/vdb/lib/trans.js';
import { DataInputComponent } from '@/vdb/framework/component-registry/component-registry.js';

export const CombinationModeInput: DataInputComponent = ({ value, onChange, ...props }) => {
    const booleanValue = value === 'true' || value === true;

    // For now, we'll assume it's always selectable since we don't have the position context
    // In the future, this could be enhanced with position-based logic
    const selectable = true;

    const setCombinationModeAnd = () => {
        onChange(true);
    };

    const setCombinationModeOr = () => {
        onChange(false);
    };

    if (!selectable) {
        return (
            <small className="text-muted-foreground">
                <Trans>Not applicable</Trans>
            </small>
        );
    }

    return (
        <div className="flex" role="group">
            <Button
                type="button"
                variant={booleanValue === true ? 'default' : 'outline'}
                className="uppercase rounded-r-none border-r-0 text-xs"
                onClick={setCombinationModeAnd}
                {...props}
            >
                <Trans>AND</Trans>
            </Button>
            <Button
                type="button"
                variant={booleanValue === false ? 'default' : 'outline'}
                className="uppercase rounded-l-none text-xs"
                onClick={setCombinationModeOr}
                {...props}
            >
                <Trans>OR</Trans>
            </Button>
        </div>
    );
};
