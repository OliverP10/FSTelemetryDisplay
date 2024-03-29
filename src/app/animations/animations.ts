import { animate, state, transition, style, trigger, query, stagger, sequence, animateChild } from '@angular/animations';

export let expandContractList = trigger('expandContractList', [
    transition('* <=> *', [
        query(':enter', [style({ transform: 'scale(0)' }), stagger('200ms', animate('200ms ease-out'))], { optional: true }),
        query(
            ':leave',
            animate(
                '00ms ease-out', //100ms
                style({
                    transform: 'scale(0)'
                })
            ),
            { optional: true }
        )
    ])
]);

export let settingDropDown = trigger('settingDropDown', [
    transition(':enter', [
        style({
            opacity: 0
        }),
        animate(
            '200ms',
            style({
                opacity: 1
            })
        )
    ]),
    transition(':leave', [
        style({
            transform: 'translateY(0%)',
            opacity: 1
        }),
        animate(
            '200ms',
            style({
                opacity: 0
            })
        )
    ])
]);

export let expandContract = trigger('expandContract', [
    transition(':enter', [
        style({
            transform: 'scale(0)'
        }),
        animate(
            '100ms',
            style({
                transform: 'scale(1)'
            })
        )
    ]),
    transition(':leave', [
        style({
            transform: 'scale(1)'
        }),
        animate(
            '200ms',
            style({
                transform: 'scale(0)'
            })
        )
    ])
]);

//fix
export let leftToRightGrow = trigger('leftToRightGrow', [
    transition(':enter', [
        style({
            width: '0% !important'
        }),
        animate(
            '1000ms',
            style({
                width: '100% !important'
            })
        )
    ]),
    transition(':leave', [style({}), animate('0ms', style({}))])
]);
