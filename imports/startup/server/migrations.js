/**
 * Created by cesar on 6/11/16.
 */
import {blueCards} from './aproved-blue-card'
import {BlueCard} from '/imports/api/blue-card/blue-card'
import {Families} from '/imports/api/family/family'
import {Groups} from '/imports/api/group/group'
import {Meteor} from 'meteor/meteor'
import {Email} from 'meteor/email'
import {Migrations} from 'meteor/percolate:migrations'
import {updateGroupCount} from '/imports/api/family/family'
import {insertBlueCards} from "/imports/api/family/family";
import {emailTemplateFixtures} from "/imports/api/email/server/email-template-fixtures";
import {EmailTemplates} from '/imports/api/email/templates'
Migrations.config({
    log: true
});

Meteor.startup(() => {
    Migrations.migrateTo('latest');
})
Migrations.add({
    version: 1,
    name: 'Update groups structure" ',
    up: function () {//code to migrate up to version 1}
        cursor = Meteor.users.find({
            "roles": "family",
            "groups.applied": {$exists: true}
        })
        const groups = Groups.find({}).fetch()
        cursor.forEach((family) => {
            const familyGroups = []
            const groupsIds = family.groups.applied
            for (let _id of groupsIds) {

                const currentGroup = _.findWhere(groups, {_id})
                if (currentGroup){
                    const familiesApplying = currentGroup.familiesApplying
                    const familyApplied = _.findWhere(familiesApplying, {familyId: family._id})
                    familyApplied.groupId=_id
                    familyGroups.push(familyApplied)
                }else{
                    console.log(family._id,_id)
                }


            }
            family.groups.applied=familyGroups
            Meteor.users.update(family._id,family)
        })
    },
})


Migrations.add({
    version: 2,
    name: 'Update groups structure 2" ',
    up: function () {//code to migrate up to version 1}

        Groups.updateBySelector({},{$rename: {"familiesApplying": "families"}},{multi: true, filter: false,validate: false})
        Meteor.users.update({},{$rename: {"groups.applied": "groupsAux"}},{multi: true})
        Meteor.users.update({},{$rename: {"groupsAux": "groups"}},{multi: true})

        let cursor=Groups.find({"families":{$exists: 1}})
        cursor.forEach((group)=>{
            let families=group.families
            families=_.map(families,(family)=>{
                family.status='applied'
                return family
            })
            group.families=families
            Groups.updateBySelector(group._id,group,{validate: false})
        })
        cursor=Meteor.users.find({"groups":{$exists: 1}})
        cursor.forEach((family)=>{
            let groups=family.groups
            groups=_.map(groups,(group)=>{
                group.status='applied'
                return group
            })
            family.group=groups
            Meteor.users.update(family._id,family)

        })
    },
})

Migrations.add({
    version: 3,
    name: 'Update groups structure 2" ',
    up: function () {//code to migrate up to version 1}
        Email.update({},{$rename: {"groups": "applied"}},{multi: true})
        BlueCard.update({},{$rename: {"groups": "applied"}},{multi: true})
    },
})
Migrations.add({
    version: 4,
    name: 'Update groups structure 3" ',
    up: function () {//code to migrate up to version 1}
        cursor=Meteor.users.find({"groups":{$exists: 1}})
        cursor.forEach((family)=>{
            updateGroupCount(family._id)
        })
    },
})




Migrations.add({
    version: 5,
    name: 'Add new confirm and cancel group templates " ',
    up: function () {//code to migrate up to version 1}
        EmailTemplates.insert( {
            "_id":"ConfirmFamily",
            "type": "System",
            "campaign": false,
            "description": "Confirm group to a family",
            "subject": "<p><span style=\"font-family: Arial; font-size: 12px; white-space: pre-wrap;\">Email subject: Confirmation for Homestay group  </span><img id=\"GroupName\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGEAAAAiCAYAAABPyrdhAAAGhklEQVRoQ+2aaUhVWxTH/7u5rCgk0yzKRi3kmVBYUj6aByKD8pvDqyjDqPe09INN2CRmaSMhSGoFFc1BadigDVRUDmHkEGVlE9mcNt/Hfz3Ofd7bvXkUwwOd/anr2Xfttddvrf9aJ64CgNjY2HClVASAP/nZXL8+AhaLpRBAalJSUqaKjY39WymV8uuPNU9wFAGl1F+EUKCU8jND1DwRsFgseSouLs7SPMebp2oRMCEYIBdMCCYEA0TAAC6YlWBCMEAEDOCCWQkmBANEwAAuNKgSXF1dMXnyZPTq1Qvt27fHw4cPcfbsWdy9e9cAV/nPhenTp6Nr167IzMyExfL/K9DcuXNx7tw5Q/na4PcEDw8PLFiwAFeuXEFhYSFqamrQvXt39OzZE2fOnDEMhLCwMPTu3Rs5OTm4du2a1a+4uDicOHECt2/fNoyvDYYQFRWFBw8eyEWcrREjRkAphW/fvmHs2LHIzs7GzZs3MWTIEIwfPx5dunTBvXv3cPToUbx580bMjBs3TjJWA9m6dWuBvXfvXlRXV0vVjRw5EiUlJRgzZozY4L9pg+fYL0J48uQJ/P39sWXLFtTW1sqWuhBatGiBgIAADB06FG5ubnj27BkOHDiAFy9eyF7tHt+/f8fo0aPx+fNnHD9+HK9fv0ZwcLD4dOvWLRw+fNh6PBOSz5isPP/QoUNWe/VR1yVH7dq1w6pVq+RSjx8/dmpz4sSJ8Pb2lirJy8uTvXQqPDxcgvbo0SMEBQWhT58+2LhxI75+/YpZs2YJhIMHD4rdNm3aICEhAampqXj69Cn69++P2bNn4/79+zh9+jQIid8pKCjAqVOnHELgXgaasnTkyJEfIHTq1ElsXL58WXylxDLA+/fvl728x/Dhw1FeXi7VRBDu7u549+4dzp8/D36fspeSkoLnz5+jQ4cOWLp0qexl0hEw/d60aZONJDoLnC4IlJyFCxcKiI8fP4qtwMBAq82ioiK8f/9enGcWJScny2cuZvWrV6+wb98++cwg0s6xY8fEaT0QIiIisGLFCjAzuVgRrI41a9Y4hEDY+fn5WLJkCXbv3o2qqiqbSrD/0oABA8SPdevWWSH069cPO3bskM99+/bFvHnzsHXrVrHFFRMTg4sXL+Lq1auYMGECBg0aJM+5mAC8Y1pamiRefUsXhG7dusmh69evt8pIaGio2Gbm79y5U5o0ITDzMzIyrOcyq1nK169ft/5t/vz5IgGsDj0QWEnLly+3fp9BmzNnjvzty5cvNnekHPHiHBiYzcOGDcP27dsFyMmTJ609oVWrVvDz88PAgQPh6ekJDh30lZVhfw9mfnx8PJKSkvDy5Us5j+dQvmiTScLAl5WVWX1hkrJSi4uL62MAXRBatmwpWZeeno6KigobowwEg+4IAh3j9/bs2WPTEAnw06dPosONgUDwBMPq+BkE9qfo6Gjk5uaKpLDvsDF37twZkZGRqKyslEymL4sXL8bq1avx4cOHHyB07NgRy5Yts4HAO7BnEQKrhNJ6584dm9iUlpbKnvqWLgg0QtpshCzvuutnELSypbayGrgYGAaPPYP6OmXKFJmydu3aJc85+q5cudKmJ9hXwtSpU+Hr64vExMQf7le3EvhQGwrYoC9cuCAQOCRQYrUzWQXU9MZCmDFjhlTTtm3b6ou3w+e6IbAxsS9wROW8zYzhlMAsoPY5kyP2CGo49ZW9gfIwbdo0bNiwQRrd4MGDMXPmTNFTBiokJAQ+Pj7YvHmzTWPWqonTEbOYGUw/7Jc9BD7nZEfQ7EuEMGrUKJEiBo3VSn/YTBsLgbFZtGiR9LkbN26AykFZ5oCgZ+mGQGM9evSQgPEAlh+l4NKlS5LRrBJHPYGZP2nSJGnkbOpsrpQhTdY4eTHwbGzUY/YJBoUSp01HrATqLacq7ud7CsdDZyOq1hO0AHh5eYF9KCsrSyC4uLiAL2+UJd6BVckz165d2yg54jmsTI6ohMrhg9XP8+q+MDoD0iAImhGOkQzG27dv9YCWPWyE1FaOgo4WA0MI9k5z1GN2U8I4ChKiNqHpPtzJRjZcTnF6AqX3LI7FVAm+W+hdjYKg13hT7CME+57QFHaNZMOEYAAahodAjW3btq31vx8MELMmd8HwEJr8xgY0aEIwABQTggnBABEwgAtmJZgQDBABA7jASuBPtP8wgC+/pQvyg2Dzp/HNy95isfyj6AJBAAhWSgU1r0u/1elFSqnUxMTEjH8BznzNHosi+qEAAAAASUVORK5CYII=\">&nbsp;<span style=\"font-family: Arial; font-size: 12px; white-space: pre-wrap;\">group</span><span style=\"font-family: Arial; font-size: 12px; white-space: pre-wrap;\"> (</span><img id=\"FromDate\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAAAiCAYAAADMDo5aAAAFM0lEQVRoQ+2abUhUaRTH/09vWpTQF60sjDQC0VZRJJFcSSjQD5lU9EHTBQ1EkV2kEVHEBCEGXykz+pIbURAZaKgfopf1JdDUXTUlkyK0VEoreiEr6y7/AzOM08jc0euy0D1fZHzuc55zf+d/znkGRgGAxWJJU0qlA4jjZ9P0EdA07R8A1Var9U9lsVh+V0pV6dtqPuWKgFLqN4L8WykVZiJaPAFN0/5S+fn52uJdmDttBEyQBmnBBGmCNIiAQW5MRZogDSJgkBtTkSbI+QSCgoIQHByMpqYmg9B45ka3Ig8ePAgG62jfv39HVdX/40tRVFQU9u7di4qKCl0E/P39MTs7i5mZGV3Pu3tIN8jjx4/jy5cvaGtrm+dzYmLC3Rn/ybqnIFNTU/H06VN0dnYaEp9HIN+8eYObN2/+cPDhw4fR09ODsLAw7N69G7W1tXj9+jX27duHyMhIrFq1CoODg2hpacHc3Jzsj46OhlIKVHVsbKwkiWX59u1bJCUlYdu2bbLnxo0bLl903bp1SE5Olip59eoVxsfHsXPnTrsifX195fzt27fL+V1dXbh165b4SklJkWepyI8fP+L27dsYGhqCn5+fnL1582ZMTk6ioaEB09PTukAbAjIrKwurV6/G8+fP0d/fL5nev38/wsPDcf36dXz+/BmHDh2SF7569aoEduDAAVBFo6Oj6O7uFpibNm3C+/fvce/ePWzYsAFsJ2wdL1++/OFlsrOz8e3bNzQ3N4NQExMTJTG20ub5X79+xaNHj7Bjxw4kJCSgsrJSSpmfmXyeTYBTU1OS4JMnT0osfX192LNnjySJezTN/bdoj0Ayu+/evbO/FNX55MkTECStrq5O/q5ZswbFxcWiMAZGY1AZGRkoLy+XLBNkYGAgzp07J+t8uRMnTuDMmTN48eKF/C8vLw8dHR2iJkfjvszMTNTU1IhyaO5KmzH29vba48nNzZXPttIm+F27dsn5tBUrVqCkpAQXLlwQgbgzj0Ay4w8ePLD7ZDlRQQySmbX1z61btyInJwdWq1VKnMbyYmDXrl3DwMCAgGQJ1dfXyzoVWFhYOG8P+zKhsyU4GocKFVxWVmb/tyuQVHhERAQYD4cL249tqjuDTE9PF3iPHz+2+4yJiUFra6vE6848ArlQj3QGSXVRMaWlpfj06ZM9BqqUpUglOINcv349ioqK5oHkQGApOoOMj49HaGgoqqurFwQZFxcn5Xn37l2Bw/MYS2Njo+xxBslqYHmzFTjayMiIrsm+LCBtUC5fvoyHDx9KXFu2bJHgWcpjY2NLAkmVscedOnVKBoZzaVP9XDt//rwMIdqxY8fmgWTFsJ+3t7fLOns4VXv27Fl34nO5viwgeRIn49q1a3Hx4kUZCkeOHAEnKSc6m/dSFMnhUlBQINPWNpjS0tLg5eUlw2blypXSJjjohoeH5QZAdbP92BRJcIzvypUrAoZtgInmOiuGPth6nj17pgvssoHkyx49elSGCK84nLyc2GwPtKWA5P6QkBBJDpPEWwEnLa9etqnNPsoWwHLm2ezlnOI2kAEBAbLf29sb9+/fx507d6Rd8PrDXslbCKf6pUuXjJ3autLi4iFmndn98OHDYl0suI8v7OPjI3dPV0YYLHPHPu38HPc73kS4vnHjRrlf8m6r13QrUq/Dn/U5E6RBmTdBmiANImCQG1ORJkiDCBjkxlSkCdIgAga5MRVpIEj+NO0Xg/z9lG7kR1Tmz/qWnntN0/5QdEOYAJKUUr8u3e1P5aFfKVV9+vTp+n8Bzc34D7I73lMAAAAASUVORK5CYII=\"><span style=\"font-family: Arial; font-size: 12px; white-space: pre-wrap;\"> to </span><img id=\"ToDate\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAAAiCAYAAAAAl7SxAAAEaElEQVRoQ+2ZWSi1WxjH/wvJnDIkXCBTyKGEGzkIUcoQEjnnFFHEORf2LvMQaSfnu8CdnCNzomRKSS4oyjzlxnRlypA5w/v1rK+9P/a3+7win/I+5WJva63nWb/1/z/r7d0MAGQy2R+MsT8B/E6fP0MIgjAP4ItCofifyWSyvxlj/36GjWvaI2PsL4Iwxxjz+qwQBEEYZ3K5XPisAJT7liAAkCBIEL4ZQlKCBEFSgupS/BB2iIuLw8zMDLa2tn7JbS0KQnh4ODw8PDQWOD8/j9HR0VcVX1BQgP7+fiwsLDy7jo6ODpydnbG6uvrsWLEDREEwNTWFgYEBX5OA3N3dqTZ+cXGB09NTsfk0jsvPz8fAwIAoCFZWVsjIyEBZWdmrcj6eLArC4wmJiYm4vb1FT0/Pd08xhuDgYPj4+IBOamlpCYODgxyWpvD29kZISAj09PQwOzsLT09PDA0NcQhaWlrw9/cHjbG0tMTe3h66urpweHgIFxcXREZGwsLCAru7u6ADaGxsBGOMr+fr64uHhwdMTU1hbGxMNKQ3gUDqoKK7u7txc3ODmJgYHBwcoL29/YdCaCOpqalc/pubm/Dy8kJgYCA6Ojo4BGNjY8THx2NychKXl5eIiIjAyckJOjs7YWJiAj8/PwQEBKClpYVD3tjYQFhYGNzd3Tl4ghgVFYWRkRGQVcXEqyHo6uqiuLgYfX19mJ6e5jkdHR2RlpaGmpoafoKPIzMzk2+uublZ9fXPeoKTkxOHUlVVxce7ubnxz0o7UP6ioiK0tbVhbW2NjwkKCoKdnR2amprEMHj5w5K6HWxtbZGdnQ2FQoGjoyOelCxRWlrKZby4uPikEPqepE+SVYY6BJpPCqEGaGNjAzMzM5SXl3N46hDo/1lZWRgeHuZWoCC72Nvbo7a29n0gODg4ID09nRd5dXWlSkrqoGZHV58yyLuVlZVobW3FysqKRggkeVLL9vY2B0X2ys3NRUVFBe8B6hAoP6mOwN7f36vWpFrm5ubeB4KRkREKCwu5R5eXl3lSa2tr5OTkoKGhATs7O08KkcvlfBwB0qSE0NBQkLqUUiYV5OXlqSC4uroiKSkJJSUlfLoyP41fX18XtWn1Qa/uCbRgSkoK9PX1eeF0GuRZ6uz19fUQhKevK6jR0W1AgM7OznhHj46O5o2PGiM1PbJCXV2dqsnRbaFUAjVOsg9JfX9/n+8nOTmZN9Te3l5+m9Ah0Nr0JybeBAI9QyQkJICkSb6k4uhmOD4+/qEGuhbpJKnhkWTp9MzNzTExMcEhGBoacnmTLegqHh8f592ebER2oIiNjeWgrq+veS+i5khPnWSV8/NzDo/6kVhlvBjCz8iSGrS1tXkhzwVtlq448rymoJOlddSVpBxLuWg+gVIGwaADoSv1JfGmEF6S+CONlSBI7xO+6VFSggRBUoKqN0t2kOwg2eGJHejNw28f6eHlPWvhP8h+9p/mBUH4hxF1AgEgmjEW+J6n8ItzLTDGvlRXV//3Ff5PUw9vK3w9AAAAAElFTkSuQmCC\"><span style=\"font-family: Arial; font-size: 12px; white-space: pre-wrap;\">) (Location: </span><img id=\"Location\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEkAAAAiCAYAAAATQPRFAAAE5klEQVRoQ+2aW0jVWRTGv215C4NAEA1FEcVKpBGVvIUSeKV0DPVBvIyoSBLhUBiEZZZJeGFKvKAvjZIpIngJpafQkFIRnMksMsWSzEteksqUtDN8GzxonHG26PhQ/w3n4fzP2mvv/Vvf+vY5cAQAZGVlJQkhfgMQyPfaAHQ63V8AbhUUFFSLrKysTCHEHxoYwwSEEMmE1C+E+EWDZJiATqfrFBcvXtRpgDYnoEFSUIgGSYOkQEAhRFOSBkmBgEKIpqQfEZKpqSns7e0xNDSkcLydCVFWUmRkJBYWFtDR0bEzKytmcXFxwZs3b7C0tCRneHp6Ijo6Gjdu3MDHjx8Vs2wvTBlSYmIi5ufncf/+/e2tuMXZOTk5qKqqwsTEhH7m/v37dw0QF90RSEIInDhxQlZ57969GBgYQHt7O1ZWVvQHoyKCg4NhaWmJt2/foqWlBe/fvwef+/v7w9bWFouLi2hra8Pz589BEPHx8bK1GPf161fU1NTI5ydPnkRFRYU+t6urK4KCgnDgwAGMjo6iublZqp7Dzs4OPj4+ePLkCcLDw2FjY4PBwUE0NjbyR6xSyXYEUkhICNzd3eXCy8vLiIqKkgerq6uTm3B0dERKSgoePHiAly9fgoeip4yPj0sQL168wLt37+Dt7Y3Dhw8jPz8fxsbGEiA/56Hn5uYkAEJLSkrC5cuXZW5nZ2f5njGEHxAQAAcHBxQXF8siOTk5gV0wOTmJhw8fSpAREREoLS2Va6qMbUMyMTHBlStX0Nrait7eXrkmN5aamoqioiLMzMwgPT1dekp1dfWmeyKY3NxcecDZ2VmYmZnh6tWruH37tr7dmHs9pDNnzkgbqK+vl7mZg3OoVO6H8cnJybh+/bre1zIzM+Vnjx8/VmG0/XZjm5w9exYFBQWy2hxsOW60oaEBT58+xbVr12Qb9fT0GNwUFePm5iZbga979+7h2bNnSpCYmwXq6+vT52ZRpqampLq+h8ogqpPtqOqv21YSWyktLU2C+PLli36jVBfB9Pf3Iy8vD7W1tdIL1g8jIyPZCubm5ujs7MTr16/BKnPz9LX/UhLnM/fdu3elj62NhIQE2fYskiFIcXFx0vh3DZKFhQWys7PlRll9joMHD+LcuXMoLy/H2NgYLly4gJGRETQ1NW2ARMA8EK/zNZO/dOmSHhJbh21SUlKi94/vD33+/Hm8evVKqkneRELI9id0fl3ZdUikT/NdG7wd6DWUL9Vw584drK6uIiYmBlZWVigrK5M3yPHjxxEYGIjKykpMT0/D2tpaese3b9+QkZEhjfrz58/w8PDA6dOnpb9QSRwE3NXVhe7ubr3frfck3ly8WVkQepOXlxdOnTqFwsJCqZZdh3TkyJENSqAp05z37duH2NhYeYvx4ATBm42b5mBbhIWFwdfXV17zrDZVxfaj9A8dOiSfs2V4ZT969EgP6dixY+DtSfj0qj179mwwbuYKDQ2Fn5+fLBjXZ5sNDw8bhMqH/1u7qVwDVBMP8enTJ4PhNHR+z1mDtxZEyPQQgjA0OI8/R6i2fxuMYet/+PBBZatbilE27i1l/cGCNUgKBdUgaZAUCCiEaErSICkQUAjRlKRBUiCgEKIpSRES/2JyVCH2pwyRf5jQ/nqzee11Ot3vgiEEBeBXIUTATykXw4f+Wwhx6+bNm3/+A6VcuQ9DsBCpAAAAAElFTkSuQmCC\"><span style=\"font-family: Arial; font-size: 12px; white-space: pre-wrap;\">)</span></p>",
            "body": "<p><span style=\"font-family: Arial; font-size: 12px; white-space: pre-wrap;\">Dear </span><img id=\"FirstName\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFQAAAAiCAYAAADBEP4dAAAFFUlEQVRoQ+2aXUiUWRzGnyMWaQqpKYaWouEX+BFBGVS7F4LgRWlYofixKvh15aLNQCkhUchgKZh1Fbki0kVGlCmIiIofaEIramZZJKZIWpqhqZWzPGeZwdEpZ6Z3w6X3wFzMvOc8539+5/n/zxl4BQBoNJpUIcQfAH7nd7VZR0Cv1/8NoFyn0/0lNBpNnhCizDoJtbc5AkKINAJ9IoSIUBH9OAG9Xt8mtFqt/selVAUDARWowl5QgapAFSagsJzqUBWowgQUllMduhWBuri4YOfOnXjz5o3C4f3/5Cx26MmTJ7F//36TFa6urqKsrAxnzpzBvn37UFpaajUBe3t7BAQE4OnTp1aP3YoDLAaakpKClZUVtLe3m6xjcnIShLJ9+3YsLi5avUZPT09kZWWhuLjY6rFbcYBVQGdnZ/Hw4cMN6zhy5Ajc3d3x4MED+Sw+Ph59fX2IiIhAWFgYKisr4erqiuPHj8Pb2xtjY2Oor6+Hm5sbYmJi5NipqSksLCzg1q1bJvp79+4F9bu7u2XfPXv2YGhoCHfv3oVe/++fvMDAQBw9elRqc1MfPXpkdDzHCiHAbOL8NAXjnJubQ2xsLKg/MDCAe/fuGefdsWOHfEbd+fl5NDY24tmzZxbtnyJAo6Oj5UKrqqrkpDk5Odi2bZusqf39/Xj9+jW0Wi2am5tlYIQ8MjKC5eVlHD58GMeOHUNNTQ2+fPmCV69emQTOMsPsIPCWlhbs2rULJ06cwPXr18HsYEtKSsLw8LD8HhkZieDgYFy5ckU+Y2yHDh3Cixcv0NvbK6EyKz5+/IjW1lY4OzuD5Yyl6+3bt3JMdnY2Pn36JOP18fGRGnzOTdisWQXU19dX7pih0a0vX76UE64Hyj43b96UXenEc+fOoby8XIJZ20JCQnD69OlvpjyBpqWl4dKlS1haWpJD8/LyJJyurq4N6+NGsnxcvXoV7969k7H5+/vjxo0bsq+fnx8yMzNRUVGBiYkJ+Vt+fj46OjrQ09Mj+6anp+Py5cvGEpaRkYHR0VG0tbVtxhNWAWXqPH782Cg6Pj4ud9ocUKbl2nqbkJAgDx8Gzg/dyWYJ0NTUVBQVFRnnpSM/fPhgUn6YnqGhoXJj+amtrcXg4OCG2OjICxcuQKfT4f3791KTGTAzM4OGhgbpYGYNS4yh0fHT09O4f/++skC/VUMtAcpI6Db2pWOrq6tlKbAFaGJiotxIZoidnZ0E4uDgIB1ETTqYz1gb18fm5OSEwsJCE6DJycnSzQQaFRWFAwcOoLOz0wQeM2t9OTJH1yqH/ihQQwB0GFPz9u3bCAoKAt178eJFs7vPTVjv0LVAmcIEwhRlDWY7f/68zUDDw8NlCaIe66i17acA3b17N1h/efKznTp1SqY8T2NDCl67ds14KKxdxGZAvby8kJubKw8h3hIOHjwo9e/cuWOTQ3kFLCgowPPnz9HU1CTrKDeNZ4XhVvE9yD8FKGtaXFycTHVeW1iv6urqjKcmAfCKxUOHtc3gNEOZ+J5D2YeOpdO5eP5B4FWI9duWlKcebwFnz56Fh4eHjJcHMbNJ0VPeWuub68/7HQ82c6nEGkiQnz9/tmkqR0dH6fqvX7/aNN7cINZbupLOt7RZ7FBLBX/1fipQhR2gAlWBKkxAYTnVoSpQhQkoLKc6VAWqMAGF5VSH/gdA+SpeuMK6v6ScfFlMfZ1Rub3X6/V/CsoRKoBYIcRvysn/Ukr9QojykpKSqn8A/sz1D4izjmIAAAAASUVORK5CYII=\"><span style=\"font-family: Arial; font-size: 12px; white-space: pre-wrap;\">,</span></p><p><span style=\"font-family: Arial; font-size: 12px; white-space: pre-wrap;\">You have been confirmed to host the </span><img id=\"GroupName\" src=\"data:image/png;base64,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\"><span style=\"font-family: Arial; font-size: 12px; white-space: pre-wrap;\"> group (</span><img id=\"FromDate\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAFIAAAAiCAYAAADMDo5aAAAFM0lEQVRoQ+2abUhUaRTH/09vWpTQF60sjDQC0VZRJJFcSSjQD5lU9EHTBQ1EkV2kEVHEBCEGXykz+pIbURAZaKgfopf1JdDUXTUlkyK0VEoreiEr6y7/AzOM08jc0euy0D1fZHzuc55zf+d/znkGRgGAxWJJU0qlA4jjZ9P0EdA07R8A1Var9U9lsVh+V0pV6dtqPuWKgFLqN4L8WykVZiJaPAFN0/5S+fn52uJdmDttBEyQBmnBBGmCNIiAQW5MRZogDSJgkBtTkSbI+QSCgoIQHByMpqYmg9B45ka3Ig8ePAgG62jfv39HVdX/40tRVFQU9u7di4qKCl0E/P39MTs7i5mZGV3Pu3tIN8jjx4/jy5cvaGtrm+dzYmLC3Rn/ybqnIFNTU/H06VN0dnYaEp9HIN+8eYObN2/+cPDhw4fR09ODsLAw7N69G7W1tXj9+jX27duHyMhIrFq1CoODg2hpacHc3Jzsj46OhlIKVHVsbKwkiWX59u1bJCUlYdu2bbLnxo0bLl903bp1SE5Olip59eoVxsfHsXPnTrsifX195fzt27fL+V1dXbh165b4SklJkWepyI8fP+L27dsYGhqCn5+fnL1582ZMTk6ioaEB09PTukAbAjIrKwurV6/G8+fP0d/fL5nev38/wsPDcf36dXz+/BmHDh2SF7569aoEduDAAVBFo6Oj6O7uFpibNm3C+/fvce/ePWzYsAFsJ2wdL1++/OFlsrOz8e3bNzQ3N4NQExMTJTG20ub5X79+xaNHj7Bjxw4kJCSgsrJSSpmfmXyeTYBTU1OS4JMnT0osfX192LNnjySJezTN/bdoj0Ayu+/evbO/FNX55MkTECStrq5O/q5ZswbFxcWiMAZGY1AZGRkoLy+XLBNkYGAgzp07J+t8uRMnTuDMmTN48eKF/C8vLw8dHR2iJkfjvszMTNTU1IhyaO5KmzH29vba48nNzZXPttIm+F27dsn5tBUrVqCkpAQXLlwQgbgzj0Ay4w8ePLD7ZDlRQQySmbX1z61btyInJwdWq1VKnMbyYmDXrl3DwMCAgGQJ1dfXyzoVWFhYOG8P+zKhsyU4GocKFVxWVmb/tyuQVHhERAQYD4cL249tqjuDTE9PF3iPHz+2+4yJiUFra6vE6848ArlQj3QGSXVRMaWlpfj06ZM9BqqUpUglOINcv349ioqK5oHkQGApOoOMj49HaGgoqqurFwQZFxcn5Xn37l2Bw/MYS2Njo+xxBslqYHmzFTjayMiIrsm+LCBtUC5fvoyHDx9KXFu2bJHgWcpjY2NLAkmVscedOnVKBoZzaVP9XDt//rwMIdqxY8fmgWTFsJ+3t7fLOns4VXv27Fl34nO5viwgeRIn49q1a3Hx4kUZCkeOHAEnKSc6m/dSFMnhUlBQINPWNpjS0tLg5eUlw2blypXSJjjohoeH5QZAdbP92BRJcIzvypUrAoZtgInmOiuGPth6nj17pgvssoHkyx49elSGCK84nLyc2GwPtKWA5P6QkBBJDpPEWwEnLa9etqnNPsoWwHLm2ezlnOI2kAEBAbLf29sb9+/fx507d6Rd8PrDXslbCKf6pUuXjJ3autLi4iFmndn98OHDYl0suI8v7OPjI3dPV0YYLHPHPu38HPc73kS4vnHjRrlf8m6r13QrUq/Dn/U5E6RBmTdBmiANImCQG1ORJkiDCBjkxlSkCdIgAga5MRVpIEj+NO0Xg/z9lG7kR1Tmz/qWnntN0/5QdEOYAJKUUr8u3e1P5aFfKVV9+vTp+n8Bzc34D7I73lMAAAAASUVORK5CYII=\"><span style=\"font-family: Arial; font-size: 12px; white-space: pre-wrap;\"> to </span><img id=\"ToDate\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEEAAAAiCAYAAAAAl7SxAAAEaElEQVRoQ+2ZWSi1WxjH/wvJnDIkXCBTyKGEGzkIUcoQEjnnFFHEORf2LvMQaSfnu8CdnCNzomRKSS4oyjzlxnRlypA5w/v1rK+9P/a3+7win/I+5WJva63nWb/1/z/r7d0MAGQy2R+MsT8B/E6fP0MIgjAP4ItCofifyWSyvxlj/36GjWvaI2PsL4Iwxxjz+qwQBEEYZ3K5XPisAJT7liAAkCBIEL4ZQlKCBEFSgupS/BB2iIuLw8zMDLa2tn7JbS0KQnh4ODw8PDQWOD8/j9HR0VcVX1BQgP7+fiwsLDy7jo6ODpydnbG6uvrsWLEDREEwNTWFgYEBX5OA3N3dqTZ+cXGB09NTsfk0jsvPz8fAwIAoCFZWVsjIyEBZWdmrcj6eLArC4wmJiYm4vb1FT0/Pd08xhuDgYPj4+IBOamlpCYODgxyWpvD29kZISAj09PQwOzsLT09PDA0NcQhaWlrw9/cHjbG0tMTe3h66urpweHgIFxcXREZGwsLCAru7u6ADaGxsBGOMr+fr64uHhwdMTU1hbGxMNKQ3gUDqoKK7u7txc3ODmJgYHBwcoL29/YdCaCOpqalc/pubm/Dy8kJgYCA6Ojo4BGNjY8THx2NychKXl5eIiIjAyckJOjs7YWJiAj8/PwQEBKClpYVD3tjYQFhYGNzd3Tl4ghgVFYWRkRGQVcXEqyHo6uqiuLgYfX19mJ6e5jkdHR2RlpaGmpoafoKPIzMzk2+uublZ9fXPeoKTkxOHUlVVxce7ubnxz0o7UP6ioiK0tbVhbW2NjwkKCoKdnR2amprEMHj5w5K6HWxtbZGdnQ2FQoGjoyOelCxRWlrKZby4uPikEPqepE+SVYY6BJpPCqEGaGNjAzMzM5SXl3N46hDo/1lZWRgeHuZWoCC72Nvbo7a29n0gODg4ID09nRd5dXWlSkrqoGZHV58yyLuVlZVobW3FysqKRggkeVLL9vY2B0X2ys3NRUVFBe8B6hAoP6mOwN7f36vWpFrm5ubeB4KRkREKCwu5R5eXl3lSa2tr5OTkoKGhATs7O08KkcvlfBwB0qSE0NBQkLqUUiYV5OXlqSC4uroiKSkJJSUlfLoyP41fX18XtWn1Qa/uCbRgSkoK9PX1eeF0GuRZ6uz19fUQhKevK6jR0W1AgM7OznhHj46O5o2PGiM1PbJCXV2dqsnRbaFUAjVOsg9JfX9/n+8nOTmZN9Te3l5+m9Ah0Nr0JybeBAI9QyQkJICkSb6k4uhmOD4+/qEGuhbpJKnhkWTp9MzNzTExMcEhGBoacnmTLegqHh8f592ebER2oIiNjeWgrq+veS+i5khPnWSV8/NzDo/6kVhlvBjCz8iSGrS1tXkhzwVtlq448rymoJOlddSVpBxLuWg+gVIGwaADoSv1JfGmEF6S+CONlSBI7xO+6VFSggRBUoKqN0t2kOwg2eGJHejNw28f6eHlPWvhP8h+9p/mBUH4hxF1AgEgmjEW+J6n8ItzLTDGvlRXV//3Ff5PUw9vK3w9AAAAAElFTkSuQmCC\"><span style=\"font-family: Arial; font-size: 12px; white-space: pre-wrap;\">) (Location: </span><img id=\"Location\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAEkAAAAiCAYAAAATQPRFAAAE5klEQVRoQ+2aW0jVWRTGv215C4NAEA1FEcVKpBGVvIUSeKV0DPVBvIyoSBLhUBiEZZZJeGFKvKAvjZIpIngJpafQkFIRnMksMsWSzEteksqUtDN8GzxonHG26PhQ/w3n4fzP2mvv/Vvf+vY5cAQAZGVlJQkhfgMQyPfaAHQ63V8AbhUUFFSLrKysTCHEHxoYwwSEEMmE1C+E+EWDZJiATqfrFBcvXtRpgDYnoEFSUIgGSYOkQEAhRFOSBkmBgEKIpqQfEZKpqSns7e0xNDSkcLydCVFWUmRkJBYWFtDR0bEzKytmcXFxwZs3b7C0tCRneHp6Ijo6Gjdu3MDHjx8Vs2wvTBlSYmIi5ufncf/+/e2tuMXZOTk5qKqqwsTEhH7m/v37dw0QF90RSEIInDhxQlZ57969GBgYQHt7O1ZWVvQHoyKCg4NhaWmJt2/foqWlBe/fvwef+/v7w9bWFouLi2hra8Pz589BEPHx8bK1GPf161fU1NTI5ydPnkRFRYU+t6urK4KCgnDgwAGMjo6iublZqp7Dzs4OPj4+ePLkCcLDw2FjY4PBwUE0NjbyR6xSyXYEUkhICNzd3eXCy8vLiIqKkgerq6uTm3B0dERKSgoePHiAly9fgoeip4yPj0sQL168wLt37+Dt7Y3Dhw8jPz8fxsbGEiA/56Hn5uYkAEJLSkrC5cuXZW5nZ2f5njGEHxAQAAcHBxQXF8siOTk5gV0wOTmJhw8fSpAREREoLS2Va6qMbUMyMTHBlStX0Nrait7eXrkmN5aamoqioiLMzMwgPT1dekp1dfWmeyKY3NxcecDZ2VmYmZnh6tWruH37tr7dmHs9pDNnzkgbqK+vl7mZg3OoVO6H8cnJybh+/bre1zIzM+Vnjx8/VmG0/XZjm5w9exYFBQWy2hxsOW60oaEBT58+xbVr12Qb9fT0GNwUFePm5iZbga979+7h2bNnSpCYmwXq6+vT52ZRpqampLq+h8ogqpPtqOqv21YSWyktLU2C+PLli36jVBfB9Pf3Iy8vD7W1tdIL1g8jIyPZCubm5ujs7MTr16/BKnPz9LX/UhLnM/fdu3elj62NhIQE2fYskiFIcXFx0vh3DZKFhQWys7PlRll9joMHD+LcuXMoLy/H2NgYLly4gJGRETQ1NW2ARMA8EK/zNZO/dOmSHhJbh21SUlKi94/vD33+/Hm8evVKqkneRELI9id0fl3ZdUikT/NdG7wd6DWUL9Vw584drK6uIiYmBlZWVigrK5M3yPHjxxEYGIjKykpMT0/D2tpaese3b9+QkZEhjfrz58/w8PDA6dOnpb9QSRwE3NXVhe7ubr3frfck3ly8WVkQepOXlxdOnTqFwsJCqZZdh3TkyJENSqAp05z37duH2NhYeYvx4ATBm42b5mBbhIWFwdfXV17zrDZVxfaj9A8dOiSfs2V4ZT969EgP6dixY+DtSfj0qj179mwwbuYKDQ2Fn5+fLBjXZ5sNDw8bhMqH/1u7qVwDVBMP8enTJ4PhNHR+z1mDtxZEyPQQgjA0OI8/R6i2fxuMYet/+PBBZatbilE27i1l/cGCNUgKBdUgaZAUCCiEaErSICkQUAjRlKRBUiCgEKIpSRES/2JyVCH2pwyRf5jQ/nqzee11Ot3vgiEEBeBXIUTATykXw4f+Wwhx6+bNm3/+A6VcuQ9DsBCpAAAAAElFTkSuQmCC\"><span style=\"font-family: Arial; font-size: 12px; white-space: pre-wrap;\">). </span></p><p><span style=\"font-family: Arial; font-size: 12px; white-space: pre-wrap;\">\nWe will send you an email confirming your guests information closer to the group's arrival.   \n\nHere is a summary of all of your confirmed groups:\n</span><img id=\"ConfirmedSummary\" src=\"data:image/png;base64,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\"></p><p><span style=\"font-family: Arial; font-size: 12px; white-space: pre-wrap;\">\nHere is a summary of other groups that you're applying for at this time:\n</span><img id=\"AppliedSummary\" src=\"data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIIAAAAiCAYAAACTHwETAAAIPElEQVR4Xu2bBYhUaxSAzzWwuwsb7Fbs7kIMFOzCxp7Fbl3WWkVQDHDFRuzuVcROVFQQuxW7Yx7fgX/eOI47d2Tfm3lv74GFnb1/nP+c78R/l7FERFwuV1fLsrqJSG0+O5IwLOB2uy+ISHRUVFSM5XK5hliWNTdhHN05pT8LWJbVHRDOW5ZVxjFRwrWA2+2OtSIiItwJ1wTOyY0FHBAcFtQCDggOCA4IDgN/W8DJCA4NTkZwGHAygsOAjwXCpjRYliWdOnWSnTt3yosXLyRZsmSSN29euXHjxh85rVChQlKsWDHZunXrH81PaJOCBqFz586SPHlyWbJkSbzaKlGiRDJ9+nRZsGCB3L9/XypUqCBt27aVadOmydu3b4Peq1KlSlKjRg2ZPXv2L3NTpkwpTZs2laJFi0rixIl1vz179si9e/eC3uf/MiEoEDJkyCC9e/eWr1+/yrp16+Thw4fxZgdfEFg4TZo0fwQBc+MCoUePHuJ2u2Xv3r3y7ds3IXsAx759++LtPP+1hYICoVatWpqyv3z5ollh9+7dnvMSvVevXpXixYtrpL1580a2bdsmN2/e1DF58uSRqlWrypUrV6Ru3bqSPn16/X3z5s3y/ft38QWB8c2bN5eFCxd69ihRooQ0aNBAAbl+/bps2rRJdUFwZOvWrdWpz5490+guXLiw34wwcuRIuXbtmurnT7p16yYnTpzQMUi+fPmkYcOGsnjxYv3MWc+dOyfoU6pUKXny5ImsXbtWcuTIIY0bN5a0adMqZKdOnfKcvUqVKnL69Glp1qyZ6h8bG6vPW7Zsqes8fvxYVq1aJe/fv9c5WbNmVTuxd5IkSeTkyZMeULHVwIEDZfny5dKuXTvJmDGjZjR0WblypedIOXPmVBuSvQE/LgkKhEGDBsnGjRvV+N27d5eoqCjP2v369VNDYACcX7FiRf2ZMWOGfPjwQR1EJN6+fVvHJE2aVA9x/vx52bVr1y8gML5r164ybtw43YPPHTt2VPgePHggTZo00V4CfZABAwYoUDt27FAoMDh9h7/SUK9ePTXy4cOH5ciRI/L58+efbBQREaFGx9lIkSJFpH379jJp0iT9zFkzZcokx44d06zYokULXePjx49y6NAhdQjOnTJlikf3Ll26yKNHj3RdAKVsAeulS5fk5cuX0qpVKzl48KACiAAemRcYCxQooKVszpw5emYTNJQ07Hfnzh159eqVjB49Wsc8f/7cswaQAGkgsQ0CC/bt21frOOJyuWT16tVaX41xUBpDICg7efJk2b59ux4ORxJp48ePlx8/fugYnEGWmDp1akAQ+vTpo3vhaIRGslevXgpKwYIFtWTNmzdPjY3EVRp4XrlyZYWJSAEG9DZRYweEW7dueTJi/fr1hYgHekpN6tSpZezYsTJr1ix1CmcncLAHwNCX8DtRzN4IIKRIkULWrFnj12fAd/bsWc0iBgRA9s7K2Pfu3bsKFDJ48GDZv3+/Zt5AYhuEOnXqqMHNJpQJUiJdvgGBDc3B+Fv//v01AzDGN8J5TmT07NlTnUk0ezeLvuMxHIYgIhCMiSOJunLlyknNmjW1sTQSCATGYfjq1avrXKJq6dKlOt0OCN5nLVOmjJaEyMhIz/4TJ07USCQ4/J19xIgRmpHOnDmjc9CDdWiWjWTPnl3Kly8vuXPnlly5culYbkH++inmlCxZUoBy7ty5ki5dOhk+fLgCB5yBxDYI0EV/YBalbqGQOTzE+oJAHaNMkPr9GYOUS/onS8QFAvuQNcgsJu2ZgxEhQIkRoqOjgwLBDM6fP7+QcUwEBwtC6dKlFUpvECZMmKAN9e9AwEn0CQaEatWqSdmyZT0g1K5dW7MWmYordKNGjbT0bNmy5bcgEBxkIvoqzoTN6TvsiC0QMmfOLEOGDFG6THMGCByWRoR05AsCzSQOpoZzWH8gUMdxIAb0pdx3PIajGQUqXyFqaOCo4Z8+fdLHcWUEdDPjTHZhLhF8+fJloReiduMohAbYrO8v+8U3CNgWfRYtWuS50nbo0CEgCOhGiaFRJ4tcuHBBz2FHbIFAc0X3umzZsp/WJJpJ1fQBgAAk1DiaQ1M3aSipi6ZZpKvFodwa6DnohqGexo6opzMnTfuCQA1Gj/Xr12uEkPpI7XTbNIejRo2SAwcOaLqlK0c3Mphvs5glSxYtWfQaOJ19adxIzTNnztTrKp02HXdMTIxnLeq+d7Ponf3iGwQie8yYMbJhwwa1FTco3t+wZ1wZAecAANCiL7Y3gRsIBlsgDB06VNPy8ePHf1qPqMPh1HYDQrZs2fRGQAmhmaSpQoxjcSJQEZUQS8agLCA0VABCjfMFAYdxdaQMkCKZj+NNc0qXzi2EtQCPjp/u3d+tgb+Tankvgrx+/VqvouYtJhC0adNGOAugk4V8bw3/JAjoBJyAz1mfPn2qgHKLCAQCc4cNG6YldMWKFYH873luCwQ7q5nScPToUY1WrjPegmO5QlEuiGBuDt7p2YwFBN+53usQLWZ9c/swzykv3OHjmu+9FhkFaEml/oSoevfunZ3j/yNj0I0yAQzBCP0cmfHixYu2p8U7CN63Bl8QvN8L2NbQGWjbAmRNSijvb+bPnx/wJZL3wg4Its0c3gN5z0NDT1mkJAT7f5N4A4HGjPr8uzsraZsxwaa58DZ/eGmXKlUqzyvqYDWLNxCC3dgZH14WcEAIL3+ETBsHhJCZPrw2dkAIL3+ETBsHhJCZPrw2dkAIL3+ETBtA4KvRpUOmgbNxyC2gX4J1vhYfcj+EXAG32z3UQgtg4D+YlmXVCrlWjgL/pgUuWpYVHRkZufwvNbAXPBvFyooAAAAASUVORK5CYII=\"></p><p><span style=\"font-family: Arial; font-size: 12px; white-space: pre-wrap;\">\nHere is a summary of other available groups that you may want to apply for:\n</span><img id=\"AvailableSummary\" src=\"data:image/png;base64,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\"></p><p><span style=\"font-family: Arial; font-size: 12px; white-space: pre-wrap;\">\n\nLight regards,\nThe Choice Homestay Team</span></p>",
            "buttons": {
                "FirstName": {
                    "contents": "First name",
                    "tooltip": "First Name",
                    "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >First name</div>"
                },
                "surname": {
                    "contents": "Surname",
                    "tooltip": "Surname",
                    "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Surname</div>"
                },
                "GroupName": {
                    "contents": "Group Name",
                    "tooltip": "Group Name",
                    "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Group Name</div>"
                },
                "FromDate": {
                    "contents": "From date",
                    "tooltip": "From date",
                    "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >From date</div>"
                },
                "ToDate": {
                    "contents": "To date",
                    "tooltip": "To date",
                    "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >To date</div>"
                },
                "Location": {
                    "contents": "Location",
                    "tooltip": "Location",
                    "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Location</div>"
                },

                "ConfirmedSummary": {
                    "contents": "Confirmed Summary",
                    "tooltip": "Confirmed Summary",
                    "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Confirmed Summary</div>"
                },

                "AppliedSummary": {
                    "contents": "Applied Summary",
                    "tooltip": "Applied Summary",
                    "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Applied Summary</div>"
                },
                "AvailableSummary": {
                    "contents": "AvailableSummary",
                    "tooltip": "AvailableSummary",
                    "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Available Summary</div>"
                },

            },
        })
        EmailTemplates.insert( {
            "_id":"UnconfirmationFamily",
            "description": "Unconfirm group to a family",
            "subject":"Unconfirmation for Homestay group ",
            "body": "body",
            "buttons": {
                "FirstName": {
                    "contents": "First name",
                    "tooltip": "First Name",
                    "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >First name</div>"
                },
                "surname": {
                    "contents": "Surname",
                    "tooltip": "Surname",
                    "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Surname</div>"
                },
                "GroupName": {
                    "contents": "Group Name",
                    "tooltip": "Group Name",
                    "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Group Name</div>"
                },
                "FromDate": {
                    "contents": "From date",
                    "tooltip": "From date",
                    "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >From date</div>"
                },
                "ToDate": {
                    "contents": "To date",
                    "tooltip": "To date",
                    "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >To date</div>"
                },
                "Location": {
                    "contents": "Location",
                    "tooltip": "Location",
                    "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Location</div>"
                },

                "ConfirmedSummary": {
                    "contents": "Confirmed Summary",
                    "tooltip": "Confirmed Summary",
                    "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Confirmed Summary</div>"
                },

                "AppliedSummary": {
                    "contents": "Applied Summary",
                    "tooltip": "Applied Summary",
                    "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Applied Summary</div>"
                },
                "AvailableSummary": {
                    "contents": "AvailableSummary",
                    "tooltip": "AvailableSummary",
                    "insertText": "<div class='label label-default'  style='display: inline-block; font: inherit !important'  >Available Summary</div>"
                },

            },
        })
    },
})



/*
 Migrations.add({
 version: 2,
 name: 'Update blue card status" ',
 up: function () {//code to migrate up to version 1}
 let cursor
 cursor = Meteor.users.find({
 "roles": "family"
 })
 cursor.forEach((family) => {
 Families.update(family._id, {$set: {version: 11}})
 })
 return true
 },
 })


 Migrations.add({
 version: 3,
 name: 'Update phone in emails reports" ',
 up: function () {//code to migrate up to version 1}
 let cursor
 cursor = Email.find({})
 cursor.forEach((email) => {
 const family = Meteor.users.findOne(email.userId)
 if (family)
 Email.update(email._id, {$set: {mobilePhone: family.parents[0].mobilePhone}})
 })
 return true
 },
 })


 Migrations.add({
 version: 4,
 name: 'Update information groups on families" ',
 up: function () {//code to migrate up to version 1}
 let cursor
 cursor = Groups.find({})
 cursor.forEach((group) => {
 const familiesApplying = group.familiesApplying || []
 for (let applied of familiesApplying) {
 Families.update(applied.familyId, {$addToSet: {"groups.applied": group._id}})
 }

 })
 return true
 },
 })

 Migrations.add({
 version: 6,
 name: 'Update information groups on families" ',
 up: function () {//code to migrate up to version 1}
 let cursor
 cursor = Groups.find({})
 cursor.forEach((group) => {
 const availablePlacements = (group.familiesApplying && group.familiesApplying.length) || 0
 Groups.attachSchema(Groups.schemas.edit, {replace: true})
 console.log('availablePlacements', 'availablePlacements')
 if (availablePlacements) {
 Groups.update(group._id, {$set: {availablePlacements}})

 }
 })
 return true
 },
 })


 Migrations.add({
 version: 7,
 name: 'Update files to aws3" ',
 up: function () {//code to migrate up to version 1}
 const version = 3
 const files = Files.collection.find()
 files.forEach((file) => {
 var filePath = 'files/' + file._id + '-original.' + file.extension
 const upd = {$set: {}}
 var cfdomain = 'https://dn369dd0j6qea.cloudfront.net'; // <-- Change to your Cloud Front Domain
 upd['$set']["versions.original.meta.pipeFrom"] = cfdomain + '/' + filePath;
 upd['$set']["versions.original.meta.pipePath"] = filePath;
 upd['$set']["version"] = version;
 const update = Files.collection.update(file._id, upd)
 })
 return true
 },
 })


 Migrations.add({
 version: 8,
 name: 'Update groups information in bluecards and emails reports" ',
 up: function () {//code to migrate up to version 1}
 const families = Families.find({"groups.applied.0": {$exists: 1}})
 console.log('--->>', families.count())
 families.forEach((family) => {
 updateGroupCount(family._id)
 })
 return true
 },
 })


 Migrations.add({
 version: 9,
 name: 'Update groups information in bluecards " ',
 up: function () {//code to migrate up to version 1}
 const families = Families.find({})
 BlueCard.remove({})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})

 Meteor.users.update({"parents.blueCard.id": {$exists: 1}}, {$unset: {"parents.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"children.blueCard.id": {$exists: 1}}, {$unset: {"children.$.blueCard.id": ""}}, {multi: true})
 Meteor.users.update({"guests.blueCard.id": {$exists: 1}}, {$unset: {"guests.$.blueCard.id": ""}}, {multi: true})
 families.forEach((family) => {
 insertBlueCards(family)
 })
 return true
 },
 })

 Migrations.add({
 version: 10,
 name: 'Update groups information in bluecards " ',
 up: function () {//code to migrate up to version 1}
 const families = Families.find({})
 for (const template of emailTemplateFixtures) {
 const exists = !!EmailTemplates.find(template._id).count()
 if (!exists) {
 EmailTemplates.insert(template)
 }
 }
 EmailTemplates.update('enrollAccount', {$set: {type: "system", campaign: true}})
 let ids = [
 "resetPassword",
 "verifyEmail",
 "welcomeEmail",
 "ReadyToProcess",
 "BeingProcessed",
 "Declined",
 "Approved",
 "NewApplication",
 "Suspended"]
 EmailTemplates.update({_id: {$in: ids}}, {$set: {type: "system", campaign: false}}, {multi: true})
 }
 })



 Migrations.add({
 version: 11,
 name: 'Recreate token for emails campaing " ',
 up: function () {

 const cursor = Email.find({loggedAt: {$eq: null}}, {limit: 1})
 cursor.forEach((email) => {
 if (email.userId){
 const user=Meteor.users.findOne(email.userId)
 let token = email.text.match(/\[http:\/\/www\.choicehomestay\.com\/enroll\-account\/(\S*)\]/gi)
 if (Array.isArray(token))
 token = token[0]
 token = token.substr(46)
 token = token.substr(0, token.length - 1)
 var when = new Date();
 var tokenRecord = {
 token: token,
 email: email.to,
 when: when,
 reason: 'enroll'
 };
 Meteor.users.update(email.userId, {
 $set: {
 "services.password.reset": tokenRecord
 }
 });
 // before passing to template, update user object with new token
 Meteor._ensure(user, 'services', 'password').reset = tokenRecord;
 }

 })
 }
 })


 Migrations.add({
 version: 12,
 name: 'Recreate token for emails campaing " ',
 up: function () {

 const cursor = Email.find({loggedAt: {$eq: null}})
 cursor.forEach((email) => {
 if (email.userId){
 const user=Meteor.users.findOne(email.userId)
 let token = email.text.match(/\[http:\/\/www\.choicehomestay\.com\/enroll\-account\/(\S*)\]/gi)
 if (Array.isArray(token))
 token = token[0]
 token = token.substr(46)
 token = token.substr(0, token.length - 1)
 var when = new Date();
 var tokenRecord = {
 token: token,
 email: email.to,
 when: when,
 reason: 'enroll'
 };
 Meteor.users.update(email.userId, {
 $set: {
 "services.password.reset": tokenRecord
 }
 });
 // before passing to template, update user object with new token
 Meteor._ensure(user, 'services', 'password').reset = tokenRecord;
 }

 })
 }
 })

 */