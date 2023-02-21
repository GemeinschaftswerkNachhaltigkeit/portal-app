import {
  trigger,
  transition,
  group,
  query,
  style,
  animate
} from '@angular/animations';

const MarketplaceItemAnimation = trigger('slideIn', [
  transition(':enter', [
    group([
      query(
        '#main-container',
        [
          style({ transform: 'translatey(50px)', opacity: 0 }),
          animate(
            '1s ease-out',
            style({
              transform: 'translateY(0px)',
              opacity: 1
            })
          )
        ],
        { optional: true }
      ),

      query(
        '#sidebar',
        [
          style({ transform: 'translateX(50px)', opacity: 0 }),
          animate(
            '1s ease-out',
            style({
              transform: 'translateX(0px)',
              opacity: 1
            })
          )
        ],
        { optional: true }
      )
    ])
  ])
]);

export { MarketplaceItemAnimation };
