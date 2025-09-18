import { Button } from 'shadcn-ui';
import { Button as MyButton } from '../Button/Button';
import { ButtonDeprecated } from '../ButtonDeprecated/ButtonDeprecated';
import { Button as ButtonRadix } from 'radix-ui/button';

export const KitchenSink = () => {
  return (
    <div>
      <Button>Shadcn Button</Button>
      <MyButton>My Button</MyButton>
      <ButtonDeprecated>Deprecated Button</ButtonDeprecated>
      <ButtonRadix>Radix Button</ButtonRadix>
    </div>
  );
};
