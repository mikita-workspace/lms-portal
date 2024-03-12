'use client';

import { getStripePromo } from '@/actions/stripe/get-stripe-promo';
import { Button } from '@/components/ui';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

type Coupon = Awaited<ReturnType<typeof getStripePromo>>['coupons'][number];

type PromoModalProps = {
  children: React.ReactNode;
  coupons: Coupon[];
};

export const PromoModal = ({ children }: PromoModalProps) => {
  return (
    <Dialog>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[445px] p-9">
        <DialogHeader>
          <DialogTitle className="text-lg font-[600]">Sign in</DialogTitle>
          <DialogDescription className="text-base">to continue to Nova LMS</DialogDescription>
        </DialogHeader>
        <div>Container</div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
