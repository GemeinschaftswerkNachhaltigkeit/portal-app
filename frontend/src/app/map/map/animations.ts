import {
  trigger,
  transition,
  style,
  query,
  group,
  animate
} from '@angular/animations';

export const slideInAnimation = trigger('routeAnimations', [
  transition('* <=> *', [
    style({ position: 'relative' }),
    query(
      ':enter, :leave',
      [
        style({
          position: 'absolute',
          top: 0,
          left: 0
        })
      ],
      { optional: true }
    ),
    query(':enter', [style({ left: '2%', opacity: 0 })], { optional: true }),
    query(':leave', [style({ left: '0%', opacity: 1 })], { optional: true }),
    group([
      query(
        ':leave',
        [animate('200ms ease-out', style({ left: '2%', opacity: 0 }))],
        {
          optional: true
        }
      ),
      query(
        ':enter',
        [animate('300ms ease-out', style({ left: '0%', opacity: 1 }))],
        {
          optional: true
        }
      )
    ])
  ])
]);
