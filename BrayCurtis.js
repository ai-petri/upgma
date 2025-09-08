/**
 * индекс несходства Брея-Кертиса
 * @param array1 {Array} численности видов в первой выборке
 * @param array2 {Array} численности видов во второй выборке
 */
export function getBrayCurtis(array1,array2)
{
    var C = 0;
    var S1 = 0;
    var S2 = 0;

    for(let i=0; i<array1.length; i++)
    {
        C += Math.min(array1[i],array2[i]);       
        S1 += array1[i];
        S2 += array2[i];
    }

    return 1 - 2*C/(S1+S2);
}
